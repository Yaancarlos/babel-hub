import {useEffect, useRef, useState} from "react";

interface CommentPopupProps {
    initialComment: string | null;
    onSave: (comment: string) => void;
    position: boolean;
    onClose: () => void;
}

export function CommentPopup({ initialComment, onSave, position, onClose }: CommentPopupProps) {
    const [text, setText] = useState(initialComment ?? '');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={ref} className={`absolute z-30 w-56 bg-white p-2 shadow-lg
                                    ${position ? '-top-34 rounded-t-md rounded-bl-md right-2' : 'top-2 rounded-b-md rounded-tl-md right-2'}`}>
            <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Escribe un comentario..."
                className="w-full resize-none rounded-md border border-gray-200 p-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="mt-2 flex items-center w-full gap-2">
                <button onClick={onClose} className="text-sm cursor-pointer rounded-md w-full px-2 py-1 bg-gray-100 border border-gray-100 text-custom-black">Cancelar</button>
                <button onClick={() => onSave(text)} className="rounded-md bg-primary w-full px-2 py-1 text-sm cursor-pointer font-medium text-white">
                    Guardar
                </button>
            </div>
        </div>
    );
}