from django.urls import include, path

from . import views


urlpatterns = [
    path('', views.api_root),
    path('groups/', views.group_list),
    path('groups/<slug:pk>/', views.group_detail),
] 



