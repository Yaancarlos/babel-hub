export interface SubjectDetails {
    id: string;
    name: string;
    area_id: string;
    grading_template_id: string;
}

export interface CreateSubject {
    id: string;
}

export interface AvailableSubjects {
    id: string;
    name: string;
}