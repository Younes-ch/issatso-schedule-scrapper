from concurrent.futures import ThreadPoolExecutor
import re
import logging
import json
from datetime import datetime
from pathlib import Path
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from issatso.models import Group
from django.urls import reverse
from .serializers import GroupSerializer

logger = logging.getLogger(__name__)

# Log file path
SCHEDULE_UPDATE_LOG = Path(__file__).parent.parent / 'logs' / 'schedule_updates.jsonl'
from .helpers import (
    BLOCS,
    CLASSROOMS,
    SESSIONS,
    WEEKDAYS,
    TIMETABLE_HEADER,
    REMEDIAL_HEADER,
    TOKEN,
    get_group_names,
    update_group,
    get_available_classrooms_from_occupied_classrooms_set,
    get_all_classrooms_occupied_by_a_group_in_a_day_and_session,
    get_classroom_availability_in_current_week,
    slugify_classroom,
    slugify_classrooms
)

# Create your views here.

@api_view(['GET'])
def api_root(request):
    return Response([
        request.build_absolute_uri() +'groups/',
        request.build_absolute_uri() + 'groups/names',
        request.build_absolute_uri() + 'groups/<slug:pk>/',
        request.build_absolute_uri() + 'groups/update',
        request.build_absolute_uri() + 'blocs/',
        request.build_absolute_uri() + 'classrooms/',
        request.build_absolute_uri() + 'classrooms/available/',
        request.build_absolute_uri() + 'classrooms/available/<slug:pk>/',
    ], status=200)

@api_view(['GET'])
def group_names(request):
    if request.method == 'GET':
        group_names = list(get_group_names())
        if group_names:
            return Response({"count": len(group_names), "group_names": group_names}, status=200)
        else:
            return Response({"error": "Method not allowed"}, status=405)

@api_view(['GET'])
def group_list(request):
    if request.method == 'GET':
        groups = Group.objects.all().order_by('name')
        paginator = Paginator(groups, 10)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        serializer = GroupSerializer(page_obj, many=True)

        base_url = request.build_absolute_uri(reverse('group_list'))
        next_page = None
        if page_obj.has_next():
            next_page = base_url + '?page=' + str(page_obj.next_page_number())
        previous_page = None
        if page_obj.has_previous():
            previous_page = base_url + '?page=' + str(page_obj.previous_page_number())

        return Response({
            'count': paginator.count,
            'next': next_page,
            'previous': previous_page,
            'results': serializer.data
        }, status=200)

@api_view(['GET'])
def group_detail(request, pk: str):
    try:
        group: Group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=404)
    
    if request.method == 'GET':
        data = GroupSerializer(group).data
        data["timetable_header"] = TIMETABLE_HEADER
        data["remedial_header"] = REMEDIAL_HEADER
        return Response(data, status=200)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def update_groups(request):
    if request.method == 'GET':
        authorization_header = request.headers.get('Authorization')
        
        # Determine the source of the request
        user_agent = request.headers.get('User-Agent', 'Unknown')
        source = 'Unknown'
        if 'AzureFunction' in user_agent:
            source = 'Azure Function'
        elif 'Postman' in user_agent:
            source = 'Postman'
        elif 'curl' in user_agent:
            source = 'curl'
        elif 'python-requests' in user_agent:
            source = 'Python Requests'
        else:
            source = user_agent[:50]  # First 50 chars of user agent
        
        if authorization_header and authorization_header == f'Bearer {TOKEN}':
            start_time = datetime.now()
            try:
                logger.info(f"Starting schedule update from {source}...")
                group_names = list(get_group_names())
                logger.info(f"Found {len(group_names)} groups to update")
                for group_name in group_names:
                    logger.info(f"Updating group: {group_name}")
                    update_group(group_name)
                logger.info("Schedule update completed successfully")
                
                # Prepare success response
                response_data = {"status": "success", "message": "Schedules updated"}
                
                # Log to file
                log_entry = {
                    'timestamp': start_time.isoformat(),
                    'source': source,
                    'status': 'success',
                    'status_code': 200,
                    'groups_updated': len(group_names),
                    'duration_seconds': (datetime.now() - start_time).total_seconds(),
                    'response': response_data
                }
                _write_log_entry(log_entry)
                
                return Response(response_data, status=200)
            except Exception as e:
                logger.error(f"Error updating schedules: {str(e)}", exc_info=True)
                
                # Prepare error response
                response_data = {"error": "Internal server error", "message": str(e)}
                
                # Log to file
                log_entry = {
                    'timestamp': start_time.isoformat(),
                    'source': source,
                    'status': 'error',
                    'status_code': 500,
                    'duration_seconds': (datetime.now() - start_time).total_seconds(),
                    'response': response_data
                }
                _write_log_entry(log_entry)
                
                return Response(response_data, status=500)
        else:
            # Log unauthorized attempt
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'source': source,
                'status': 'unauthorized',
                'status_code': 401,
                'response': {"error": "Unauthorized"}
            }
            _write_log_entry(log_entry)
            
            return Response({"error": "Unauthorized"}, status=401)
    else:
        return Response({"error": "Method not allowed"}, status=405)


def _write_log_entry(log_entry: dict):
    """Write a log entry to the schedule updates log file."""
    try:
        # Ensure log directory exists
        SCHEDULE_UPDATE_LOG.parent.mkdir(parents=True, exist_ok=True)
        
        # Append log entry as JSON line
        with open(SCHEDULE_UPDATE_LOG, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    except Exception as e:
        logger.warning(f"Failed to write to log file: {str(e)}")
    
@api_view(['GET'])
def bloc_list(request):
    if request.method == 'GET':
        return Response({"blocs": sorted(BLOCS)}, status=200)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def classroom_list(request):
    if request.method == 'GET':
        classrooms = sorted(list(CLASSROOMS))
        classrooms = [slugify_classroom(classroom) for classroom in classrooms]
        return Response({"classrooms": classrooms}, status=200)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def available_classroom_list(request):
    if request.method == 'GET':
        weekday: str = str(request.GET.get('weekday')).title()
        session: str = str(request.GET.get('session')).title()
        if weekday and session and weekday in WEEKDAYS and session in SESSIONS:
            if weekday == "samedi" and session in ["S4", "S5", "S6"]:
                return Response({"error": "Samedi and (S4, S5, S6) are not a valid combination, Choose S4' instead."}, status=400)
            groups = Group.objects.all()
            occupied_classrooms: set[str] = set()
            
            for group in groups:
                occupied_classrooms_by_a_group = get_all_classrooms_occupied_by_a_group_in_a_day_and_session(group, weekday, session)
                occupied_classrooms.update(occupied_classrooms_by_a_group)

            available_classrooms = get_available_classrooms_from_occupied_classrooms_set(occupied_classrooms)
            available_classrooms_by_bloc = {bloc: [] for bloc in BLOCS}
            
            for classroom in available_classrooms:
                available_classrooms_by_bloc[classroom[0]].append(classroom)
            
            available_classrooms_by_bloc = dict(sorted(available_classrooms_by_bloc.items()))
            for bloc, classrooms in available_classrooms_by_bloc.items():
                available_classrooms_by_bloc[bloc] = slugify_classrooms(classrooms)

            return Response({"available_classrooms": available_classrooms_by_bloc}, status=200)
        else:
            return Response({"error": "Invalid weekday or session"}, status=400)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def classroom_availability_list(request, classroom: str):
    if request.method == 'GET':
        if classroom.startswith("amphi"):
            if classroom == "amphi-golli-salem":
                classroom = "Amphi: GOLLI Salem" 
            elif classroom == "amphi-laatiri-mokhtar":
                classroom = "Amphi: LAATIRI Mokhtar"
        else:
            classroom = classroom.upper()
        if classroom in CLASSROOMS:
            classroom_availability = get_classroom_availability_in_current_week(classroom)
            return Response(classroom_availability, status=200)
        else:
            return Response({"error": "Classroom not found"}, status=404)