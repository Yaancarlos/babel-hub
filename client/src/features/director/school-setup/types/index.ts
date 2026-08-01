export interface PeriodProps {
    id: string,
    name: string,
    start_date: string,
    end_date: string
}

export interface AreaProps {
    id: string;
    name: string;
    school_id: string;
}

export interface SubjectsProps {
    id: string;
    name: string;
    area_id: string;
    grading_template_id: string;
}

export interface GradingTemplate {
    id: string;
    name: string;
    school_id: string;
    scale_id: string;
}

export interface Scale {
    id: string;
    name: string;
    min_value: number;
    max_value: number;
    passing_value: number;
}