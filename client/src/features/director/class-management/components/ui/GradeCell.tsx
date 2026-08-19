import { useState, useRef, useEffect } from "react";
import { TbMessageFilled } from "react-icons/tb";
import { CommentPopup } from "./CommentPopup";

interface GradeCellProps {
    value: number | null;
    name: string;
    comment: string | null;
    studentPosition: { index: number, studentsObj: number };
    studentName: string;
    assignmentName: string;
    minValue: number;
    maxValue: number;
    onCommit: (value: number | null) => void;
    onCommentCommit: (comment: string) => void;
}

const REGEXP = {
    number: /^[0-9]+(\.[0-9]{1,2})?$/
};

export function GradeCell({ value, name, comment, studentPosition, onCommentCommit, assignmentName, studentName, minValue, maxValue, onCommit }: GradeCellProps) {
    const [editing, setEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>('');
    const [commentOpen, setCommentOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editing]);

    const startEditing = () => {
        setDraft(value === null ? '' : String(value));
        setEditing(true);
    };

    const commit = () => {
        if (draft.trim() === '') {
            onCommit(null);
            setEditing(false);
            return;
        }

        const parsed = Number(draft);
        if (
            Number.isNaN(parsed) ||
            parsed < minValue ||
            parsed > maxValue ||
            !REGEXP.number.test(draft)
        ) {
            setEditing(false);
            return;
        }

        onCommit(parsed);
        setEditing(false);
    };

    if (editing) {
        return (
            <td className="p-1 text-center">
                <input
                    ref={inputRef}
                    name={name.split('-').join('').slice(0, 10)}
                    type="number"
                    min={minValue}
                    max={maxValue}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                        if (e.key === 'Escape') setEditing(false);
                        if (e.key === 'Enter') commit();
                    }}
                    aria-label={`Calificación de ${studentName} en ${assignmentName}`}
                    className="w-14 rounded-md border border-primary bg-background px-1 py-1.5 text-center text-sm font-medium tabular-nums outline-none ring-2 ring-primary/20"
                />
            </td>
        );
    }

    return (
        <td className="p-1 text-center">
            <div className="flex justify-center items-center">
                <div className="relative group w-fit">
                    <button
                        onClick={startEditing}
                        aria-posinset={studentPosition.index}
                        aria-level={studentPosition.studentsObj}
                        aria-label={`Editar calificación de ${studentName} en ${assignmentName}${value === null ? ' (sin calificar)' : `: ${value}`}`}
                        className="mx-auto flex h-9 w-14 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors group-hover:ring-2 group-hover:ring-primary/20"
                    >
                        {value === null ? '—' : value}
                    </button>

                    <button onClick={() => setCommentOpen(true)} className={`absolute -top-2 bg-primary/20 cursor-pointer text-primary -right-2 rounded-full p-0.5
                                    ${value === null ? 'hidden' : 'group-hover:inline hidden'}`}>
                        <TbMessageFilled className="text-sm"/>
                    </button>

                    {commentOpen && (
                        <CommentPopup
                            initialComment={comment}
                            position={studentPosition.index === studentPosition.studentsObj || studentPosition.index === studentPosition.studentsObj - 1 }
                            onSave={(newComment) => { onCommentCommit(newComment); setCommentOpen(false); }}
                            onClose={() => setCommentOpen(false)}
                        />
                    )}
                </div>
            </div>
        </td>
    );
}