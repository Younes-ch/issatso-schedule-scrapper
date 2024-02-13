# ISSATSo Schedule Scrapper

This repository contains an [API](./server) that fetches the schedule of the students of the Higher Institute of Applied Sciences and Technology of Sousse (ISSATSo) from the official website and based on that it provides information about Available classrooms in a specific day and session or the availability of a single classroom in a week, all returned in JSON format and it is consumed by an interactive and responsive [frontend](./client) application.

## Features

- Fetch the schedule of the students of the Higher Institute of Applied Sciences and Technology of Sousse (ISSATSo) from the official website.
- Provide information about Available classrooms in a specific day and session.
- Provide information about the availability of a single classroom in a week.

## Technologies

- [ReactJS](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Requests](https://requests.readthedocs.io/en/master/)
- [Docker](https://www.docker.com/)

## Installation

If you want to run the project locally, you can follow the following steps:

### Clone the repository

```bash
git clone https://github.com/Younes-ch/issatso-schedule-scrapper.git
```

### Set up the environment variables

Create `.env` files in both projects [Server](./server/) and [Client](./client/), There are reference files for the environment variables in the root of each project, you can copy them and rename them to `.env` and fill in the required information.

### Run the project

#### Using Docker

```bash
cd issatso-schedule-scrapper
docker-compose up
```

#### Manually

```bash
cd issatso-schedule-scrapper/server
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python manage.py migrate # Remember to have a postgres database running either with docker or locally or hosted on the cloud.
python manage.py runserver

# Open a new terminal
cd issatso-schedule-scrapper/client
npm install
npm run dev
```

## Usage

1. First you need to send a GET request to the `/api/groups/update` endpoint with `Authorization` header of your ISSATSo Token to fetch the schedule of the students of the Higher Institute of Applied Sciences and Technology of Sousse (ISSATSo) from the official website.

2. The API is consumed by the frontend application, you can access it by visiting the following URL: [http://localhost:3000](http://localhost:3000)
