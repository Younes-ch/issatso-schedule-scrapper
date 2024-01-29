from dotenv import load_dotenv
from bs4 import BeautifulSoup
import datetime
import requests
import json
import os

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
    occupied_classrooms_from_timetable = {}
    soup = BeautifulSoup(group_instance.timetable_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    for row in rows:
        cells = row.find_all('td')

        if cells[0].text.strip() in weekdays:
            weekday = cells[0].text.strip()[2:]
            if not weekday in occupied_classrooms_from_timetable:
                occupied_classrooms_from_timetable[weekday] = {}
            continue

        if cells[0].text.strip() in SESSIONS:
            session = cells[0].text.strip()
            classroom = cells[6].text.strip()
            if session in occupied_classrooms_from_timetable[weekday] and not classroom in occupied_classrooms_from_timetable[weekday][session]:
                occupied_classrooms_from_timetable[weekday][session].append(classroom)
            else:
                occupied_classrooms_from_timetable[weekday][session] = [classroom]
            continue
    return json.dumps(occupied_classrooms_from_timetable)

def extract_occupied_classrooms_from_remedial(group_instance: Group):
    occupied_classrooms_from_remedial = {}
    soup = BeautifulSoup(group_instance.remedial_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    if len(rows) == 0:
        return json.dumps({})
    for row in rows:
        cells = row.find_all('td')

        weekday = cells[0].text.strip()
        date = cells[1].text.strip()
        session = cells[2].text.strip()
        classroom = cells[5].text.strip()
        
        if date in occupied_classrooms_from_remedial:
            if weekday in occupied_classrooms_from_remedial[date]:
                if session in occupied_classrooms_from_remedial[date][weekday]:
                    if not classroom in occupied_classrooms_from_remedial[date][weekday][session]:
                        occupied_classrooms_from_remedial[date][weekday][session].append(classroom)
                else:
                    occupied_classrooms_from_remedial[date][weekday][session] = [classroom]
            else:
                occupied_classrooms_from_remedial[date][weekday] = {}
                occupied_classrooms_from_remedial[date][weekday][session] = [classroom]
        else:
            occupied_classrooms_from_remedial[date] = {}
            occupied_classrooms_from_remedial[date][weekday] = {}
            occupied_classrooms_from_remedial[date][weekday][session] = [classroom]

    return json.dumps(occupied_classrooms_from_remedial)

def merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial):
    current_date = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1))).strftime("%d/%m/%Y")
    occupied_classrooms = {}
    if current_date in occupied_classrooms_from_remedial:
        occupied_classrooms = occupied_classrooms_from_remedial[current_date]
    for weekday in occupied_classrooms_from_timetable:
        if weekday in occupied_classrooms:
            for session in occupied_classrooms_from_timetable[weekday]:
                if session in occupied_classrooms[weekday]:
                    occupied_classrooms[weekday][session] += occupied_classrooms_from_timetable[weekday][session]
                    occupied_classrooms[weekday][session] = list(set(occupied_classrooms[weekday][session]))
                else:
                    occupied_classrooms[weekday][session] = occupied_classrooms_from_timetable[weekday][session]
        else:
            occupied_classrooms[weekday] = occupied_classrooms_from_timetable[weekday]
    return json.dumps(occupied_classrooms)

    
def update_group(group_name):
    try:
        group = Group.objects.get(pk=group_name)
    except Group.DoesNotExist:
        group = Group(name=group_name)
    group.timetable_html = get_group_timetable(group_name)
    group.remedial_html = get_group_remedial(group_name)
    occupied_classrooms_from_timetable = json.loads(extract_occupied_classrooms_from_timetable(group))
    occupied_classrooms_from_remedial = json.loads(extract_occupied_classrooms_from_remedial(group))
    group.occupied_classrooms = merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial)
    group.save()