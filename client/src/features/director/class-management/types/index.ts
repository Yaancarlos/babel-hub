export interface Grades {
    id: string;
    student_id: string;
    assignment_id: string;
    value: number;
    comment: string | null;
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

export function tone(value: number){
    if (value === null) return 'text-gray-400'
    if (value >= 90) return 'text-emerald-600'
    if (value >= 70) return 'text-lime-600'
    if (value >= 60) return 'text-amber-600'
    return 'text-red-600'
}