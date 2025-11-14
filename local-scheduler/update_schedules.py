import datetime
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests
import psycopg2
from psycopg2.extras import Json

# Load environment variables
load_dotenv()

# Database Configuration
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT', '5432')

# ISSATSO API Configuration
TOKEN = os.getenv('TOKEN')
ISSATSO_API_URL = os.getenv('ISSATSO_API_URL', 'https://issatso.rnu.tn/bo/public/api/')
ISSATSO_GROUP_NAMES_URL = ISSATSO_API_URL + 'groups/all/list'
ISSATSO_TIMETABLE_URL = ISSATSO_API_URL + 'student/timetable/'
ISSATSO_REMEDIAL_URL = ISSATSO_API_URL + 'student/rattrapage/'

headers = {
    'Authorization': f'Bearer {TOKEN}',
}

# Constants
WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
SESSIONS = ["S1", "S2", "S3", "S4", "S4'", "S5", "S6"]

# Setup logging to file
SCRIPT_DIR = Path(__file__).parent
LOG_DIR = SCRIPT_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / f"schedule_update_{datetime.datetime.now().strftime('%Y-%m')}.log"

class Logger:
    """Simple logger that writes to both console and file"""
    def __init__(self, log_file):
        self.log_file = log_file
        self.file_handle = None
    
    def __enter__(self):
        self.file_handle = open(self.log_file, 'a', encoding='utf-8')
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file_handle:
            self.file_handle.close()
    
    def log(self, message):
        """Print message with timestamp to both console and file"""
        timestamp = datetime.datetime.now()
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        if self.file_handle:
            self.file_handle.write(log_message + '\n')
            self.file_handle.flush()

logger = None

def log(message):
    """Print message with timestamp"""
    if logger:
        logger.log(message)
    else:
        print(f"[{datetime.datetime.now()}] {message}")

def get_db_connection():
    """Create database connection"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        return conn
    except Exception as e:
        log(f"ERROR: Failed to connect to database: {str(e)}")
        raise

def get_group_names():
    """Fetch all group names from ISSATSO API"""
    response = requests.get(ISSATSO_GROUP_NAMES_URL, headers=headers)
    if response.status_code == 200:
        for group in response.json():
            if group['designation'] != "GroupeTD":
                yield group['designation']
    else:
        log(f"ERROR: Failed to fetch group names. Status: {response.status_code}")
        return None

def get_group_timetable(group_name):
    """Fetch timetable HTML for a group"""
    response = requests.get(ISSATSO_TIMETABLE_URL + group_name, headers=headers)
    if response.status_code == 200:
        log(f"Getting timetable for {group_name}")
        return response.json()["html"]
    else:
        log(f"ERROR: Failed to fetch timetable for {group_name}")
        return None

def get_group_remedial(group_name):
    """Fetch remedial HTML for a group"""
    response = requests.get(ISSATSO_REMEDIAL_URL + group_name, headers=headers)
    if response.status_code == 200:
        log(f"Getting remedial for {group_name}")
        return response.json()["html"]
    else:
        log(f"ERROR: Failed to fetch remedial for {group_name}")
        return None

def extract_occupied_classrooms_from_timetable(timetable_html):
    """Extract occupied classrooms from timetable HTML"""
    weekdays = ["1-Lundi", "2-Mardi", "3-Mercredi", "4-Jeudi", "5-Vendredi", "6-Samedi"]
    occupied_classrooms_from_timetable = {}
    soup = BeautifulSoup(timetable_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    
    for row in rows:
        cells = row.find_all('td')

        if cells[0].text.strip() in weekdays:
            weekday = cells[0].text.strip()[2:]
            if weekday not in occupied_classrooms_from_timetable:
                occupied_classrooms_from_timetable[weekday] = {}
            continue

        if cells[0].text.strip() in SESSIONS:
            session = cells[0].text.strip()
            classroom = cells[6].text.strip()
            if session in occupied_classrooms_from_timetable[weekday] and classroom not in occupied_classrooms_from_timetable[weekday][session]:
                occupied_classrooms_from_timetable[weekday][session].append(classroom)
            else:
                occupied_classrooms_from_timetable[weekday][session] = [classroom]
            continue
    
    return occupied_classrooms_from_timetable

def extract_occupied_classrooms_from_remedial(remedial_html):
    """Extract occupied classrooms from remedial HTML"""
    occupied_classrooms_from_remedial = {}
    soup = BeautifulSoup(remedial_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    
    if len(rows) == 0:
        return {}
    
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
                    if classroom not in occupied_classrooms_from_remedial[date][weekday][session]:
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

    return occupied_classrooms_from_remedial

def merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial):
    """Merge timetable and remedial occupied classrooms"""
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

def extract_timetable_info_from_timetable_html_to_json(timetable_html):
    """Extract timetable info from HTML to JSON"""
    timetable_info = {}
    soup = BeautifulSoup(timetable_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    timetable_info["num_rows"] = len(rows)
    
    for i, row in enumerate(rows):
        timetable_info[f"row_{i+1}"] = []
        cells = row.find_all('td')
        for cell in cells:
            timetable_info[f"row_{i+1}"].append(cell.text.strip())
    
    return timetable_info

def extract_remedial_info_from_remedial_html_to_json(remedial_html):
    """Extract remedial info from HTML to JSON"""
    remedial_info = {}
    soup = BeautifulSoup(remedial_html, 'html.parser')
    table = soup.find('table')
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')
    remedial_info["num_rows"] = 1 if len(rows) == 0 else len(rows)
    
    if len(rows) == 0:
        remedial_info["row_1"] = ["Aucune séance de rattrapage"]
        return remedial_info
    
    for i, row in enumerate(rows):
        remedial_info[f"row_{i+1}"] = []
        cells = row.find_all('td')
        for cell in cells:
            remedial_info[f"row_{i+1}"].append(cell.text.strip())
    
    return remedial_info

def update_group(conn, group_name):
    """Update a single group in the database"""
    cursor = conn.cursor()
    
    # Fetch data from ISSATSO API
    timetable_html = get_group_timetable(group_name)
    remedial_html = get_group_remedial(group_name)
    
    if not timetable_html or not remedial_html:
        log(f"WARNING: Skipping {group_name} due to missing data")
        return False
    
    # Extract information
    timetable_info_json = extract_timetable_info_from_timetable_html_to_json(timetable_html)
    remedial_info_json = extract_remedial_info_from_remedial_html_to_json(remedial_html)
    occupied_classrooms_from_timetable = extract_occupied_classrooms_from_timetable(timetable_html)
    occupied_classrooms_from_remedial = extract_occupied_classrooms_from_remedial(remedial_html)
    occupied_classrooms = merge_occupied_classrooms(occupied_classrooms_from_timetable, occupied_classrooms_from_remedial)
    
    # Upsert into database (INSERT ... ON CONFLICT UPDATE)
    cursor.execute("""
        INSERT INTO issatso_group (name, timetable_html, remedial_html, timetable_info_json, remedial_info_json, occupied_classrooms)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (name) DO UPDATE SET
            timetable_html = EXCLUDED.timetable_html,
            remedial_html = EXCLUDED.remedial_html,
            timetable_info_json = EXCLUDED.timetable_info_json,
            remedial_info_json = EXCLUDED.remedial_info_json,
            occupied_classrooms = EXCLUDED.occupied_classrooms
    """, (
        group_name,
        timetable_html,
        remedial_html,
        Json(timetable_info_json),
        Json(remedial_info_json),
        occupied_classrooms
    ))
    
    conn.commit()
    cursor.close()
    log(f"✓ Updated {group_name}")
    return True

def update_schedules():
    """Main function to update all schedules"""
    global logger
    
    # Validate environment variables
    required_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'TOKEN']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        log(f"ERROR: Missing required environment variables: {', '.join(missing_vars)}")
        return False
    
    try:
        # Connect to database
        log("Connecting to database...")
        conn = get_db_connection()
        log(f"✓ Connected to database: {DB_NAME}")
        
        # Fetch group names
        log("Fetching group names from ISSATSO API...")
        group_names = list(get_group_names())
        log(f"✓ Found {len(group_names)} groups")
        
        # Update each group
        updated_count = 0
        failed_count = 0
        
        for group_name in group_names:
            try:
                if update_group(conn, group_name):
                    updated_count += 1
                else:
                    failed_count += 1
            except Exception as e:
                log(f"ERROR: Failed to update {group_name}: {str(e)}")
                failed_count += 1
        
        # Close connection
        conn.close()
        log("✓ Database connection closed")
        
        # Summary
        log("="*60)
        log(f"Schedule update completed!")
        log(f"  Total groups: {len(group_names)}")
        log(f"  Successfully updated: {updated_count}")
        log(f"  Failed: {failed_count}")
        log("="*60)
        
        return failed_count == 0
        
    except Exception as e:
        log(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    with Logger(LOG_FILE) as logger:
        log("Starting schedule update task")
        log(f"Log file: {LOG_FILE}")
        success = update_schedules()
        exit(0 if success else 1)
