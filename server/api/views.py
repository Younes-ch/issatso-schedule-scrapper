from concurrent.futures import ThreadPoolExecutor
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from issatso.models import Group
from django.urls import reverse
from .serializers import GroupSerializer
from .helpers import (
    BLOCS,
    CLASSROOMS,
    SESSIONS,
    WEEKDAYS,
    TOKEN,
    get_group_names,
    update_group,
    get_available_classrooms_from_occupied_classrooms_set,
    get_all_classrooms_occupied_by_a_group_in_a_day_and_session,
    get_classroom_availability_in_current_week
)

# Create your views here.

@api_view(['GET'])
def api_root(request):
    return Response([
        request.build_absolute_uri() +'groups/',
        request.build_absolute_uri() + 'groups/names',
        request.build_absolute_uri() + 'groups/<slug:pk>/',
        request.build_absolute_uri() + 'groups/update',
        request.build_absolute_uri() + 'classrooms/',
        request.build_absolute_uri() + 'classrooms/available/',
        request.build_absolute_uri() + 'classrooms/available/<slug:pk>/',
    ], status=200)

@api_view(['GET'])
def group_names(request):
    if request.method == 'GET':
        group_names = get_group_names()
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
def group_detail(request, pk):
    try:
        group: Group = Group.objects.get(pk=pk.upper())
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=404)
    
    if request.method == 'GET':
        serializer = GroupSerializer(group)
        return Response(serializer.data, status=200)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def update_groups(request):
    if request.method == 'GET':
        authorization_header = request.headers.get('Authorization')
        
        if authorization_header and authorization_header == f'Bearer {TOKEN}':
            group_names = get_group_names()
            if group_names:
                # for group_name in group_names:
                #     update_group(group_name)
                with ThreadPoolExecutor(max_workers=10) as executor:
                    executor.map(update_group, group_names)
            # update_group("ING-A1-01")
            return Response({"status": "success"}, status=200)
        else:
            return Response({"error": "Unauthorized"}, status=401)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def classroom_list(request):
    if request.method == 'GET':
        classrooms = sorted(list(CLASSROOMS))
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

            return Response({"available_classrooms": available_classrooms_by_bloc}, status=200)
        else:
            return Response({"error": "Invalid weekday or session"}, status=400)
    else:
        return Response({"error": "Method not allowed"}, status=405)
    
@api_view(['GET'])
def classroom_availability_list(request, classroom: str):
    if request.method == 'GET':
        classroom = classroom.upper()
        if classroom in CLASSROOMS:
            classroom_availability = get_classroom_availability_in_current_week(classroom)
            return Response(classroom_availability, status=200)
        else:
            return Response({"error": "Classroom not found"}, status=404)