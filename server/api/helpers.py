import requests
from dotenv import load_dotenv
import os

load_dotenv()

TOKEN = os.getenv('TOKEN')
ISSATSO_TIMETABLES_URL = os.getenv('ISSATSO_API_URL') + 'groups/all/list'
ISSATSO_TIMETABLE_URL = os.getenv('ISSATSO_API_URL') + 'student/timetable/'
headers = {
    'Authorization': f'Bearer {TOKEN}',
}

def get_group_names():
    response = requests.get(ISSATSO_TIMETABLES_URL, headers=headers)
    if response.status_code == 200:
        for group in response.json():
            yield group['designation']
    else:
        return None
    
def get_group_timetable(group_name):
    response = requests.get(ISSATSO_TIMETABLE_URL + group_name, headers=headers)
    if response.status_code == 200:
        return response.json()["html"]
    else:
        return None

    