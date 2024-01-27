from django.urls import include, path

from . import views


urlpatterns = [
    path('', views.api_root),
    path('groups/', views.group_list),
    path('groups/names', views.group_names),
    path('groups/<slug:pk>/', views.group_detail),
    path('groups/update', views.update_groups),
] 



