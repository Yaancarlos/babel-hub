export interface PeriodProps {
    id: string,
    name: string,
    start_date: string,
    end_date: string
}

export interface AreaProps {
    id: string;
    school_id: string;
    name: string;
}

export interface SubjectsProps {
    id: string;
    name: string;
    area_id: string;
}