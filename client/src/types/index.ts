export type UserRole = "principal" | "admin" | "teacher" | "student" | "parent" | null;
export type ModalModeTypes = 'create' | 'edit' | 'none';

interface NameInput {
    firstName: string;
    middleName?: string | null | undefined;
    firstLastName: string;
    secondLastName?: string | null | undefined;
}

// 18th August 2026
export function formateDate(date: string) {
    return  new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export const getStatusDotColor = (status: string) => {
    switch(status) {
        case 'absent': return 'bg-red-500 border-red-500';
        case 'late': return 'bg-yellow-400 border-yellow-400';
        case 'present': return 'bg-green-500 border-green-500';
        case 'excused': return 'bg-blue-500 border-blue-500';
        default: return 'bg-gray-300 border-gray-300';
    }
};


// 18 - AUG - MON
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
        dayNum: date.getUTCDate(),
        month: date.toLocaleString('es-ES', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
        weekday: date.toLocaleString('es-ES', { weekday: 'short', timeZone: 'UTC' }).toUpperCase()
    };
}

// August 1 - 30 or Jan 1 - Mar 5
export const formatDatePeriod = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return '';

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const startDay = start.getDate();
    const endDay = end.getDate();

    const startMonth = start.toLocaleString('es-ES', { month: 'long' });
    const endMonth = end.toLocaleString('es-ES', { month: 'long' });

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    if (startMonth === endMonth && startYear === endYear) {
        return `${cap(startMonth)} ${startYear} ${startDay} - ${endDay}`;
    }

    if (startYear === endYear) {
        return `${cap(startMonth)} ${startDay} - ${cap(endMonth)} ${endDay}, ${startYear}`;
    }

    return `${cap(startMonth)} ${startDay}, ${startYear} - ${cap(endMonth)} ${endDay}, ${endYear}`;
};



export const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) return (names[0][0] + (names[1][0] ? names[1][0] : names[0][names[0].length - 1])).toUpperCase();
    return name[0].toUpperCase();
};

export function reverseName(nameObj: NameInput): string {
    const lastNames = [nameObj.firstLastName, nameObj.secondLastName]
        .filter(Boolean)
        .join(" ");

    const firstNames = [nameObj.firstName, nameObj.middleName]
        .filter(Boolean)
        .join(" ");

    return [lastNames, firstNames].filter(Boolean).join(" ");
}

export const formatterDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

export interface Grades {
    id: string;
    student_id: string;
    assignment_id: string;
    value: number;
    comment: string | null;
}

export interface Scales {
    id: string;
    name: string;
    min_value: number;
    max_value: number;
    passing_value: number;
}

export interface Assignment {
    id: string;
    name: string;
    due_date: string;
    created_at: string;
    grades: Grades[];
}

export interface Student {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    email: string;
}

export interface AssessmentCriteria {
    id: string;
    name: string;
    weight: number;
    assignments: Assignment[];
}

export interface AssignmentsOverview {
    assessment_criteria: AssessmentCriteria[];
    grades: Grades[];
}

interface CLassDetails {
    id: string;
    course_id: string;
    course_name: string;
    subject_name: string;
    teacher_id: string;
    teacher_first_name: string;
    teacher_middle_name: string | null;
    teacher_first_last_name: string;
    teacher_second_last_name: string | null;
    created_at: string;
}

export interface ClassDetailsData {
    details: CLassDetails;
    students:   Student[];
}

export interface GradeRecords {
    studentId: string;
    value: number;
    comment: string | null;
}

function calcAssignmentAverage(assignments: Assignment[], studentId: string): number | null {
    let sum = 0;
    let gradedCount = 0;

    for (const assignment of assignments) {
        const grade = assignment.grades.find((g) => g.student_id === studentId);
        if (grade) {
            sum += grade.value;
            gradedCount++;
        }
    }

    if (gradedCount === 0) return null;
    return sum / gradedCount;
}

export function finalGradeForStudent(assessments: AssessmentCriteria[], studentId: string): number | null {
    let totalGrade = 0;
    let totalWeightGraded = 0;

    for (const assessment of assessments) {
        const average = calcAssignmentAverage(assessment.assignments, studentId);
        if (average === null) continue;

        const weight = assessment.weight / 100;
        totalGrade += average * weight;
        totalWeightGraded += weight;
    }

    if (totalWeightGraded === 0) return null;
    return totalGrade;
}

interface GradeScale {
    min: number;
    max: number;
    passing: number;
}

export function tone(value: number | null | undefined, scale: GradeScale): string {
    if (value === null || value === undefined || Number.isNaN(value) || typeof value !== "number") {
        return 'bg-gray-50';
    }

    if (value < scale.passing) return 'bg-red-50 text-red-700';

    const passingRange = scale.max - scale.passing;

    if (passingRange <= 0) return 'bg-emerald-50 text-emerald-700';

    const ratio = (value - scale.passing) / passingRange;

    if (ratio >= 0.75) return 'bg-emerald-50 text-emerald-700';
    if (ratio >= 0.33) return 'bg-lime-50 text-lime-700';

    return 'bg-amber-50 text-amber-700';
}

const MESSAGES = {
    bajo: [
        "Incumplimiento de los criterios de evaluación.",
        "Incumplimiento de los compromisos académicos establecidos.",
        "No alcanza los criterios de evaluación establecidos para la actividad.",
        "Presenta dificultades en el alcance de los logros y niveles de desempeño esperados.",
        "Incumple los criterios de evaluación establecidos para el proceso evaluativo.",
        "Requiere fortalecer el alcance de los logros y la aplicación de los aprendizajes en situaciones concretas."
    ],
    basico: [
        "Alcanza los logros y niveles de desempeño, reconociendo nociones y conceptos fundamentales.",
        "Reconoce los conceptos trabajados, aunque presenta dificultades para aplicarlos en situaciones concretas.",
        "Alcanza los desempeños básicos y requiere fortalecer la aplicación de los conceptos en diferentes situaciones."
    ],
    alto: [
        "Alcanza los logros y niveles de desempeño, demostrando dominio de nociones y conceptos.",
        "Aplica adecuadamente las nociones y conceptos trabajados en situaciones concretas.",
        "Demuestra un desempeño destacado en la comprensión y aplicación de los aprendizajes."
    ],
    superior: [
        "Alcanza los logros y niveles de desempeño, demostrando dominio de los conceptos y su aplicación.",
        "Aplica y transfiere los aprendizajes de manera efectiva en diferentes situaciones.",
        "Demuestra dominio sobresaliente de los aprendizajes y capacidad para aplicarlos en diferentes contextos."
    ]
};

export function suggestedComment(value: number, min: number, max: number, passing: number): string {
    if (max <= min || passing <= min) return "";

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (value < passing) {
        return getRandom(MESSAGES.bajo);
    }

    const passRatio = (value - passing) / (max - passing);

    if (passRatio < 0.33) {
        return getRandom(MESSAGES.basico);
    }

    if (passRatio < 0.66) {
        return getRandom(MESSAGES.alto);
    }

    return getRandom(MESSAGES.superior);
}