from concurrent.futures import ThreadPoolExecutor
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.decorators import api_view
from issatso.models import Group
from django.urls import reverse
from .serializers import GroupSerializer
from .helpers import get_group_names, update_group

# Create your views here.

@api_view(['GET'])
def api_root(request):
    return Response([
        request.build_absolute_uri() +'groups/',
        request.build_absolute_uri() + 'groups/names',
        request.build_absolute_uri() + 'groups/<slug:pk>/',
        request.build_absolute_uri() + 'groups/update',
    ])

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
        group = Group.objects.get(pk=pk.upper())
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
        return JsonResponse({"status": "success"})
    else:
        return HttpResponse(status=404)

