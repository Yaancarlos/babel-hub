import type { ValidScales } from "./Grade.types.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export function validateGrade(scales: ValidScales, value: number) {
    if (value < scales.min_value || value > scales.max_value) {
        throw new ValidationError(`El valor de la nota debe estar dentro del rango asignado ${scales.min_value} - ${scales.max_value}`);
    }
}