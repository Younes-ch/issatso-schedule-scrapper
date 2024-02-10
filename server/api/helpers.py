import re
from typing import Literal
import datetime
import json
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests

from issatso.models import Group

load_dotenv()

# Stuff needed for ISSATSO API
TOKEN = os.getenv('TOKEN')
ISSATSO_API_URL = os.getenv('ISSATSO_API_URL')
ISSATSO_GROUP_NAMES_URL = ISSATSO_API_URL + 'groups/all/list'
ISSATSO_TIMETABLE_URL = ISSATSO_API_URL + 'student/timetable/'
ISSATSO_REMEDIAL_URL = ISSATSO_API_URL + 'student/rattrapage/'
headers = {
    'Authorization': f'Bearer {TOKEN}',
}

# Global variables
WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
SESSIONS = ["S1", "S2", "S3", "S4", "S4'", "S5", "S6"]
CLASSROOMS = {
        'Amphi: GOLLI Salem',  'Amphi: LAATIRI Mokhtar', 'B08-A', 'B09', 'B10',
        'B16', 'F01', 'F02', 'F03', 'F05', 'G01', 'G02', 'G03', 'G04', 'G05',
        'G06', 'G07', 'G08', 'G10', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17',
        'G18', 'G19', 'G20', 'G21', 'H01', 'H02', 'H03', 'H04', 'H05', 'H06',
        'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13', 'H14', 'I-02', 'I-03',
        'I-04', 'I-05', 'I-06', 'I-07', 'I-08', 'I-09', 'I-10', 'I-11', 'I-12',
        'I-13', 'I-14', 'I-15', 'I-16', 'I-17', 'I-18', 'I-19', 'J05', 'J06', 'J07',
        'J08', 'J09', 'K01', 'K02', 'K03', 'K04', 'K05', 'K06', 'K07', 'K08', 'K09',
        'K10', 'K11', 'K12', 'K13', 'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'M01',
        'M01-1', 'M01-2', 'M01-3', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08',
        'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18-1', 'M18-2'
    }
BLOCS = {classroom[0] for classroom in CLASSROOMS}
TIMETABLE_HEADER = ["Jours", "Début", "Fin", "Matière", "Enseignant", "Type", "Salle", "Régime"]
REMEDIAL_HEADER = ["Jour", "Date", "Séance", "Matière", "Enseignant", "Salle", "Type"]

def get_group_names():
    response = requests.get(ISSATSO_GROUP_NAMES_URL, headers=headers)
    if response.status_code == 200:
        for group in response.json():
            yield group['designation']
    else:
        return None
    
def get_group_timetable(group_name) -> str | None:
    response = requests.get(ISSATSO_TIMETABLE_URL + group_name, headers=headers)
    if response.status_code == 200:
        print("Getting timetable for " + group_name)
        return response.json()["html"]
    else:
        return None
    
def get_group_remedial(group_name) -> str | None:
    response = requests.get(ISSATSO_REMEDIAL_URL + group_name, headers=headers)
    if response.status_code == 200:
        print("Getting remedial for " + group_name)
        return response.json()["html"]
    else:
        return None
    
def extract_occupied_classrooms_from_timetable(group_instance: Group) -> str:
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

def extract_occupied_classrooms_from_remedial(group_instance: Group) -> str:
    occupied_classrooms_from_remedial = {}
    soup = BeautifulSoup(group_instance.remedial_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    if len(rows) == 0:
        return json.dumps({})
    for row in rows:
        cells = row.find_all('td')

        if len(cells) == 0:
            continue

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

def merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial) -> str:
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

def extract_timetable_info_from_timetable_html_to_json(group_instance: Group) -> str:
    timetable_info = {"header": TIMETABLE_HEADER}
    soup = BeautifulSoup(group_instance.timetable_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    for i, row in enumerate(rows):
        timetable_info[f"row_{i+1}"] = []
        cells = row.find_all('td')
        for cell in cells:
            timetable_info[f"row_{i+1}"].append(cell.text.strip())
    return json.dumps(timetable_info, ensure_ascii=False)

def extract_remedial_info_from_remedial_html_to_json(group_instance: Group) -> str:
    remedial_info = {"header": REMEDIAL_HEADER}
    soup = BeautifulSoup(group_instance.remedial_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    if len(rows) == 0:
        remedial_info["row_1"] =  ["Aucune séance de rattrapage"]
        return json.dumps(remedial_info, ensure_ascii=False)
    for i, row in enumerate(rows):
        remedial_info[f"row_{i+1}"] = []
        cells = row.find_all('td')
        for cell in cells:
            remedial_info[f"row_{i+1}"].append(cell.text.strip())
    return json.dumps(remedial_info, ensure_ascii=False)
   
def update_group(group_name) -> None:
    try:
        group = Group.objects.get(pk=group_name)
    except Group.DoesNotExist:
        group = Group(name=group_name)
    group.timetable_html = get_group_timetable(group_name)
    group.remedial_html = get_group_remedial(group_name)
    group.timetable_info_json = json.loads(extract_timetable_info_from_timetable_html_to_json(group))
    group.remedial_info_json = json.loads(extract_remedial_info_from_remedial_html_to_json(group))
    occupied_classrooms_from_timetable = json.loads(extract_occupied_classrooms_from_timetable(group))
    occupied_classrooms_from_remedial = json.loads(extract_occupied_classrooms_from_remedial(group))
    group.occupied_classrooms = merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial)
    group.save()

def get_all_classrooms_occupied_by_a_group_in_a_day_and_session(
        group: Group,
        weekday: Literal["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        session: Literal["S1", "S2", "S3", "S4", "S4'", "S5", "S6"]
    ) -> list[str]:
    occupied_classrooms = json.loads(group.occupied_classrooms)
    if weekday in occupied_classrooms:
        if session in occupied_classrooms[weekday]:
            return occupied_classrooms[weekday][session]
    return []

def get_available_classrooms_from_occupied_classrooms_set(occupied_classrooms: set[str]) -> list[str]:
    return list(CLASSROOMS - occupied_classrooms)

def get_classroom_availability_in_current_week(classroom: str) -> str:
    groups = Group.objects.all()
    availability = {weekday : {session: True for session in SESSIONS if session != "S4'"} for weekday in WEEKDAYS}
    availability["Samedi"]["S4'"] = True
    del availability["Samedi"]["S4"]
    del availability["Samedi"]["S5"]
    del availability["Samedi"]["S6"]
    for weekday in WEEKDAYS:
        for session in SESSIONS:
            for group in groups:
                if not (weekday == "Samedi" and session in ["S4", "S5", "S6"]):
                    occupied_classrooms = get_all_classrooms_occupied_by_a_group_in_a_day_and_session(group, weekday, session)
                    if classroom in occupied_classrooms:
                        availability[weekday][session] = False
    return availability

def slugify_classroom(classroom: str) -> dict[str, str]:
    classroom_object = {"label": classroom, "value": re.sub(r'\W+', '-', classroom).lower()}
    return classroom_object

def slugify_classrooms(classrooms: list[str]) -> list[dict[str, str]]:
    return [slugify_classroom(classroom) for classroom in classrooms]