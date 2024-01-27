from concurrent.futures import ThreadPoolExecutor
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from issatso.models import Group

from .serializers import GroupSerializer
from .helpers import get_group_names, get_group_timetable
import threading

# Create your views here.

@api_view(['GET'])
def api_root(request):
    return Response({
        'groups': '/groups/',
    })

@api_view(['GET'])
def group_names(request):
    if request.method == 'GET':
        group_names = get_group_names()
        if group_names:
            return Response(group_names)
        else:
            return HttpResponse(status=404)

@api_view(['GET'])
def group_list(request):
    if request.method == 'GET':
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def group_detail(request, pk):
    try:
        group = Group.objects.get(pk=pk)
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
                executor.map(update_group_timetable, group_names)

            return HttpResponse(status=200)
        else:
            return HttpResponse(status=404)

def update_group_timetable(group_name):
    try:
        group = Group.objects.get(pk=group_name)
        group.timetable_html = get_group_timetable(group_name)
        group.save()
    except Group.DoesNotExist:
        group = Group(name=group_name, timetable_html=get_group_timetable(group_name))
        group.save()
