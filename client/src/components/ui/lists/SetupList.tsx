import { LoadingContent } from "../Loadings.tsx";
import {HiDotsVertical, HiPencil, HiTrash} from "react-icons/hi";
import {useEffect, useRef, useState} from "react";

interface ListRowsProps<T> {
    items: T[];
    loading: boolean;
    emptyMessage: string;
    getKey: (item: T) => string;
    getTitle: (item: T) => string;
    getSubtitle: (item: T) => string;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
}

export function ListRows<T>({
                                items,
                                loading,
                                emptyMessage,
                                getKey,
                                getTitle,
                                getSubtitle,
                                onEdit,
                                onDelete
                            }: ListRowsProps<T>) {
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setIdx(null);
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    if (loading) return <LoadingContent title='Cargando' />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
            ) : (
                <ul className="divide-gray-100 flex flex-col gap-2 divide-y">
                    {items.map((item, index) => (
                        <li key={getKey(item)} className="py-2 px-4 flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors">
                            <div>
                                <p className="font-medium capitalize text-base text-custom-black">{getTitle(item)}</p>
                                <span className="font-base text-xs text-gray-400">{getSubtitle(item)}</span>
                            </div>


                            <div className="relative" ref={ref}>
                                <button
                                    onClick={() => {
                                        setOpen((v) => !v)
                                        setIdx(index);
                                    }}
                                    aria-label="Opciones de la asignación"
                                    aria-haspopup="menu"
                                    aria-expanded={open}
                                    className="rounded text-custom-black opacity-100 transition-opacity cursor-pointer hover:bg-gray-100 data-[open=true]:opacity-100"
                                    data-open={open}
                                >
                                    <HiDotsVertical />
                                </button>

                                {open && index === idx && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full z-20 mt-1 max-w-[150px] overflow-hidden p-1 rounded-xl border border-gray-200 bg-white text-left shadow-lg"
                                    >
                                        <button
                                            role="menuitem"
                                            onClick={() => {
                                                setOpen(false)
                                                onEdit(item)
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                        >
                                            <HiPencil className="size-3.5" /> Renombrar
                                        </button>
                                        <button
                                            role="menuitem"
                                            onClick={() => {
                                                setOpen(false)
                                                onDelete(item)
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <HiTrash className="size-3.5" /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}