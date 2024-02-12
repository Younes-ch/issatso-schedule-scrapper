interface TableInfo {
    [key: string]: number | string[];
    num_rows: number;
}

export default interface Group {
    name: string;
    timetable_info_json: TableInfo;
    remedial_info_json: TableInfo;
    timetable_header: string[];
    remedial_header: string[];
}