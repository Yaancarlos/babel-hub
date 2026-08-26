import { LoadingContent } from "../Loadings.tsx";
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";

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

    if (loading) return <LoadingContent title='Cargando' />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
            ) : (
                <ul className="divide-gray-100 flex flex-col gap-2 divide-y">
                    {items.map((item) => (
                        <ListRowItem
                            key={getKey(item)}
                            item={item}
                            title={getTitle(item)}
                            subtitle={getSubtitle(item)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

interface ListRowItemProps<T> {
    item: T;
    title: string;
    subtitle: string;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
}

function ListRowItem<T>({ item, title, subtitle, onEdit, onDelete }: ListRowItemProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                menuRef.current && !menuRef.current.contains(target) &&
                buttonRef.current && !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <li className="py-2 px-4 flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors">
            <div>
                <p className="font-medium capitalize text-base text-custom-black">{title}</p>
                <span className="font-base text-xs text-gray-400">{subtitle}</span>
            </div>

            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label="Opciones"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    className={`rounded p-1 text-custom-black transition-colors cursor-pointer ${isOpen ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                    <HiDotsVertical />
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        role="menu"
                        className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden p-1 rounded-xl border border-gray-200 bg-white text-left shadow-lg"
                    >
                        <button
                            role="menuitem"
                            onClick={() => {
                                setIsOpen(false);
                                onEdit(item);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
                        >
                            <HiPencil className="size-3.5" /> Renombrar
                        </button>
                        <button
                            role="menuitem"
                            onClick={() => {
                                setIsOpen(false);
                                onDelete(item);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                        >
                            <HiTrash className="size-3.5" /> Eliminar
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}