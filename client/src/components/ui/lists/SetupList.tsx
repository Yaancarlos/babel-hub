import { LoadingContent } from "../Loadings.tsx";
import { DeleteButton, EditButton } from "../buttons/Buttons.tsx";

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
                        <li key={getKey(item)} className="py-2 px-4 flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors">
                            <div>
                                <p className="font-medium capitalize text-base text-custom-black">{getTitle(item)}</p>
                                <span className="font-base text-xs text-gray-400">{getSubtitle(item)}</span>
                            </div>

                            <div className="space-x-4">
                                <EditButton onClick={() => onEdit(item)} />
                                <DeleteButton onClick={() => onDelete(item)} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}