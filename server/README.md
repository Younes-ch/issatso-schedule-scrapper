# API

The API is deployed on Azure at the following URL: [https://win-nerkech-api.azurewebsites.net/](https://win-nerkech-api.azurewebsites.net/)

## Background Tasks

The API includes an automated background task system that updates schedules daily at 2:00 AM. The background task calls the `/api/groups/update` endpoint using the `TOKEN` environment variable for authentication.

### Features
- **Automatic Updates**: Schedules are updated daily without manual intervention
- **Error Handling**: Includes timeout and error handling for reliable operation
- **Logging**: All task activities are logged for monitoring
- **Manual Trigger**: Can be manually triggered using Django management commands

For detailed information, see [BACKGROUND_TASKS.md](./BACKGROUND_TASKS.md)

## ENV Variables

- `SECRET_KEY`: The secret key for the Django project.

```bash
# To generate a new secret key run the following command in the terminal and copy the output.
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

- `TOKEN`: Your ISSATSO API token for schedule updates (required for background tasks)
- Check the rest of the required env variables [Here](./.env.sample)

## Endpoints

### `GET /api/groups/`

Get all groups.

#### Response

```json
{
    "count": number,
    "next": string,
    "previous": string,
    "results": [
        {
            "name": string,
            "timetable_info_json": {
                "num_rows": number,
                "row_1": string[],
                "row_2": string[],
                ...
                "row_n": string[]
            },
            "remedial_info_json": {
                "num_rows": number,
                "row_1": string[],
                "row_2": string[],
                ...
                "row_n": string[]
            }
        }
    ]
}
```

### `GET /api/groups/<group_name>/`

#### Path Parameters

- `group_name (required)`: The name of the group. (Possible values are the names of the groups from [/api/groups/](#get-apigroupsnames))

Get a specific group.

#### Response

```json
{
    "name": string,
    "timetable_info_json": {
        "num_rows": number,
        "row_1": string[],
        "row_2": string[],
        ...
        "row_n": string[]
    },
    "remedial_info_json": {
        "num_rows": number,
        "row_1": string[],
        "row_2": string[],
        ...
        "row_n": string[]
    },
    "timetable_header": string[],
    "remedial_header": string[]
}
```

### `GET /api/groups/names`

Get all groups names.

#### Response

```json
{
    "count": number,
    "group_names": string[]
}
```

### `GET /api/groups/update`

#### Headers

- `Authorization (required)`: Your ISSATSo Token.

Fetch the schedule of the students of the Higher Institute of Applied Sciences and Technology of Sousse (ISSATSo) from the official website.

#### Response

```json
{
    "status": "success"
}
```

### `GET /api/blocs/`

Get all blocs.

#### Response

```json
{
    "blocs": string[]
}
```

### `GET /api/classrooms/`

Get all classrooms.

#### Response

```json
{
    "classrooms": {label: string, value: string}[]
}
```

### `GET /api/classrooms/available/`

#### Query Parameters

- `weekday (required)`: The day of the week in french:
  - `lundi`
  - `mardi`
  - `mercredi`
  - `jeudi`
  - `vendredi`
  - `samedi`
- `session (required)`: The session of the day:
  - `s1`: 8:30 - 10:00
  - `s2`: 10:10 - 11:40
  - `s3`: 11:50 - 13:20
  - `s4`: 13:50 - 15:20
  - `s4'`: 13:30 - 15:00
  - `s5`: 15:30 - 17:00
  - `s6`: 17:10 - 18:40

Get information about Available classrooms in a specific day and session.

#### Response

```json
{
    "available_classrooms": {
        "A": {label: string, value: string}[] | empty,
        "B": {label: string, value: string}[] | empty,
        "F": {label: string, value: string}[] | empty,
        "G": {label: string, value: string}[] | empty,
        "H": {label: string, value: string}[] | empty,
        "I": {label: string, value: string}[] | empty,
        "J": {label: string, value: string}[] | empty,
        "K": {label: string, value: string}[] | empty,
        "L": {label: string, value: string}[] | empty,
        "M": {label: string, value: string}[] | empty,
    }
}
```

### `GET /api/classrooms/available/<classroom>/`

#### Path Parameters

- `classroom (required)`: The classroom name. (Possible values are the names of the classrooms from [/api/classrooms/](#get-apiclassrooms), the `value` field of the classroom object)

Get information about the availability of a single classroom in a week.

#### Response

```json
{
    "Lundi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4": boolean,
        "S5": boolean,
        "S6": boolean
    },
    "Mardi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4": boolean,
        "S5": boolean,
        "S6": boolean
    },
    "Mercredi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4": boolean,
        "S5": boolean,
        "S6": boolean
    },
    "Jeudi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4": boolean,
        "S5": boolean,
        "S6": boolean
    },
    "Vendredi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4": boolean,
        "S5": boolean,
        "S6": boolean
    },
    "Samedi": {
        "S1": boolean,
        "S2": boolean,
        "S3": boolean,
        "S4'": boolean,
    }
}
```
