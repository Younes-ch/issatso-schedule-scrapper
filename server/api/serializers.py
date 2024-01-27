from rest_framework.serializers import ModelSerializer
from issatso.models import Group

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        read_only_fields = ['name']

