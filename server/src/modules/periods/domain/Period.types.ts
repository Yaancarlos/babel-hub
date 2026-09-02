export interface Period {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean
}

export interface CreatePeriod {
    id: string;
}

export interface UpdatePeriod {
    id: string;
}