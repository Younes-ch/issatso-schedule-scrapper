from concurrent.futures import ThreadPoolExecutor
from django.http import HttpResponse, JsonResponse
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
    get_group_names,
    update_group,
    get_available_classrooms_from_occupied_classrooms_set,
    get_all_classrooms_occupied_by_a_group_in_a_day_and_session
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
        request.build_absolute_uri() + 'classrooms/available/'
    ])

@api_view(['GET'])
def group_names(request):
    if request.method == 'GET':
        group_names = get_group_names()
        if group_names:
            return Response({"group_names": group_names})
        else:
            return HttpResponse(status=404)

@api_view(['GET'])
def group_list(request):
    if request.method == 'GET':
        groups = Group.objects.all()
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
        })

@api_view(['GET'])
def group_detail(request, pk):
    try:
        group: Group = Group.objects.get(pk=pk.upper())
    except Group.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        serializer = GroupSerializer(group)
        return Response(serializer.data)
    
@api_view(['GET'])
def update_groups(request):
    if request.method == 'GET':
        group_names = get_group_names()
        if group_names:
            with ThreadPoolExecutor(max_workers=10) as executor:
                executor.map(update_group, group_names)
        # update_group("ING-A1-01")
        return JsonResponse({"status": "success"})
    else:
        return HttpResponse(status=404)
    
@api_view(['GET'])
def classroom_list(request):
    if request.method == 'GET':
        classrooms = sorted(list(CLASSROOMS))
        return Response({"classrooms": classrooms})
    else:
        return HttpResponse(status=404)
    
@api_view(['GET'])
def available_classroom_list(request):
    if request.method == 'GET':
        weekday: str = str(request.GET.get('weekday')).title()
        session: str = str(request.GET.get('session')).title()
        if weekday and session and weekday in WEEKDAYS and session in SESSIONS:
            if weekday == "samedi" and session == "s4":
                return Response({"error": "Samedi and S4 is not a valid combination, Choose S4' instead"})
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

            return Response({"available_classrooms": available_classrooms_by_bloc})
        else:
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=404)


