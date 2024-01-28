from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests
import os
import json

from issatso.models import Group

load_dotenv()

# Stuff needed for ISSATSO API

TOKEN = os.getenv('TOKEN')
ISSATSO_GROUP_NAMES_URL = os.getenv('ISSATSO_API_URL') + 'groups/all/list'
ISSATSO_TIMETABLE_URL = os.getenv('ISSATSO_API_URL') + 'student/timetable/'
ISSATSO_REMEDIAL_URL = os.getenv('ISSATSO_API_URL') + 'student/rattrapage/'
headers = {
    'Authorization': f'Bearer {TOKEN}',
}

# Global variables
SESSIONS = ["S1", "S2", "S3", "S4", "S4'", "S5", "S6"]

def get_group_names():
    response = requests.get(ISSATSO_GROUP_NAMES_URL, headers=headers)
    if response.status_code == 200:
        for group in response.json():
            yield group["designation"]
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
    
def extract_occupied_classrooms_from_timetable(group_instance: Group):
    weekdays = ["1-Lundi", "2-Mardi", "3-Mercredi", "4-Jeudi", "5-Vendredi", "6-Samedi"]
    occupied_classrooms = {}
    soup = BeautifulSoup(group_instance.timetable_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    for row in rows:
        cells = row.find_all('td')

        if cells[0].text.strip() in weekdays:
            weekday = cells[0].text.strip()
            occupied_classrooms[weekday] = {}
            continue

        if cells[0].text.strip() in SESSIONS:
            session = cells[0].text.strip()
            classroom = cells[6].text.strip()
            if session in occupied_classrooms[weekday] and not classroom in occupied_classrooms[weekday][session]:
                occupied_classrooms[weekday][session].append(classroom)
            else:
                occupied_classrooms[weekday][session] = [classroom]
            continue
    return json.dumps(occupied_classrooms)

    
def update_group(group_name):
    try:
        group = Group.objects.get(pk=group_name)
        group.timetable_html = get_group_timetable(group_name)
        group.remedial_html = get_group_remedial(group_name)
        group.occupied_classrooms = extract_occupied_classrooms_from_timetable(group)
        group.save()
    except Group.DoesNotExist:
        group = Group(name=group_name, timetable_html=get_group_timetable(group_name), remedial_html=get_group_remedial(group_name))
        group.occupied_classrooms = extract_occupied_classrooms_from_timetable(group)
        group.save()
    