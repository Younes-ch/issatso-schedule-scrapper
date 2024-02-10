from django.urls import include, path

from . import views


urlpatterns = [
    path('', views.api_root),
    path('groups/', views.group_list, name='group_list'),
    path('groups/names', views.group_names, name='group_names'),
    path('groups/<slug:pk>/', views.group_detail, name='group_detail'),
    path('groups/update', views.update_groups),
    path('blocs/', views.bloc_list, name='bloc_list'),
    path('classrooms/', views.classroom_list, name='classroom_list'),
    path('classrooms/available/', views.available_classroom_list, name='available_classroom_list'),
    path('classrooms/available/<slug:classroom>/', views.classroom_availability_list, name='classroom_availability_list'),
] 



