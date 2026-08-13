import {ValidationError} from "../../errors/domain/CustomErrors.js";

export function assertValidDueDate(dueDate: string): void {
    const today = new Date().toISOString().slice(0, 10);
    if (dueDate < today) {
        throw new ValidationError('No puedes colocar una fecha anterior al día de hoy');
    }
}