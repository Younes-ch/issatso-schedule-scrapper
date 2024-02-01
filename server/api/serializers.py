from rest_framework.serializers import ModelSerializer
from issatso.models import Group

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'timetable_info_json', 'remedial_info_json']
        read_only_fields = ['name']

