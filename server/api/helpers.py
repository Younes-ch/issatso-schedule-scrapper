import requests
from dotenv import load_dotenv
import os

from issatso.models import Group

load_dotenv()

TOKEN = os.getenv('TOKEN')
ISSATSO_GROUP_NAMES_URL = os.getenv('ISSATSO_API_URL') + 'groups/all/list'
ISSATSO_TIMETABLE_URL = os.getenv('ISSATSO_API_URL') + 'student/timetable/'
ISSATSO_REMEDIAL_URL = os.getenv('ISSATSO_API_URL') + 'student/rattrapage/'
headers = {
    'Authorization': f'Bearer {TOKEN}',
}

def get_group_names():
    response = requests.get(ISSATSO_GROUP_NAMES_URL, headers=headers)
    if response.status_code == 200:
        for group in response.json():
            yield group['designation']
    else:
        return None
    
def get_group_timetable(group_name):
    response = requests.get(ISSATSO_TIMETABLE_URL + group_name, headers=headers)
    if response.status_code == 200:
        print("Getting timetable for " + group_name)
        return response.json()["html"]
    else:
        return None
    
def get_group_remedial(group_name):
    response = requests.get(ISSATSO_REMEDIAL_URL + group_name, headers=headers)
    if response.status_code == 200:
        print("Getting remedial for " + group_name)
        return response.json()["html"]
    else:
        return None
    
def update_group(group_name):
    try:
        group = Group.objects.get(pk=group_name)
        group.timetable_html = get_group_timetable(group_name)
        group.remedial_html = get_group_remedial(group_name)
        group.save()
    except Group.DoesNotExist:
        group = Group(name=group_name, timetable_html=get_group_timetable(group_name), remedial_html=get_group_remedial(group_name))
        group.save()
    