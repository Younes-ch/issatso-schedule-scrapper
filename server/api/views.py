from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from issatso.models import Group

from .serializers import GroupSerializer

# Create your views here.

@api_view(['GET'])
def api_root(request):
    return Response({
        'groups': '/groups/',
    })

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
