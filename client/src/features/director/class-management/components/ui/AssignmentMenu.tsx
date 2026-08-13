import type { AssessmentCriteria, Assignment } from "../../types";
import {useEffect, useRef, useState} from "react";
import {HiDotsVertical, HiPencil, HiTrash} from "react-icons/hi";

interface AssignmentMenuProps {
    assessmentCriteria: AssessmentCriteria;
    assignment: Assignment;
    onEditAssignment: (ac: AssessmentCriteria, asg: Assignment) => void;
    onDeleteAssignment: (asg: Assignment) => void;
}

export function AssignmentMenu({
                                   assessmentCriteria,
                                   assignment,
                                   onEditAssignment,
                                   onDeleteAssignment
                               }: AssignmentMenuProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Opciones de la asignación"
                aria-haspopup="menu"
                aria-expanded={open}
                className="rounded text-gray-500 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-900 group-hover:opacity-100 data-[open=true]:opacity-100"
                data-open={open}
            >
                <HiDotsVertical className="size-3.5" />
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-lg"
                >
                    <button
                        role="menuitem"
                        onClick={() => {
                            setOpen(false)
                            onEditAssignment(assessmentCriteria, assignment)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                        <HiPencil className="size-3.5" /> Renombrar
                    </button>
                    <button
                        role="menuitem"
                        onClick={() => {
                            setOpen(false)
                            onDeleteAssignment(assignment)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                        <HiTrash className="size-3.5" /> Eliminar
                    </button>
                </div>
            )}
        </div>
    )
}