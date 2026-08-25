export interface SubjectDetails {
    area_id: string;
    area_name: string;
    id: string;
    name: string;
    grading_template_id: string;
    grading_template_name: string;
}

export interface CreateSubject {
    id: string;
}

export interface AvailableSubjects {
    id: string;
    name: string;
}