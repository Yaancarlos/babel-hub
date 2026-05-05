export type modeTypes = 'create' | 'edit';

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