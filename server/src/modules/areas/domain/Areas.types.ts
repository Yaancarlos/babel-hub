export interface Area {
    id: string;
    name: string;
    school_id: string;
}

interface Subjects {
    id: string;
    name: string;
    grading_template_id: string;
    grading_template_name: string;
}

export interface AreaDetails {
    area: Area;
    subjects: Subjects[];
}