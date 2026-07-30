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
    id: string
    name: string
    school_id: string
    scale_id: string
}