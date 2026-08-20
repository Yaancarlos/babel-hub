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