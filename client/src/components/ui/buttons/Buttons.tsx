import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { type JSX } from "react";

interface CancelButtonProps {
    title: string;
    onClick?: () => void;
}

export const CancelButton = ({ title, onClick }: CancelButtonProps) => {
    return (
        <button
            onClick={onClick}
            className='bg-gray-100 text-sm md:text-base hover:bg-gray-200 text-custom-black border border-gray-300 px-5 py-2 rounded-lg transition-colors cursor-pointer w-full'
        >
            {title}
        </button>
    )
}

interface PrimaryButtonProps {
    title: string | JSX.Element;
    full?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    form?: string;
    type?: "submit" | "reset" | "button" | undefined;
    className?: string;
}

export const PrimaryButton = ({ title, onClick, full, type, disabled, form, className }: PrimaryButtonProps) => {
    return (
        <button
            form={form}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`bg-primary-shadow text-sm xl:text-base hover:bg-primary text-primary-darker hover:text-white md:px-3 lg:px-5 py-2 rounded-lg font-semibold transition-colors ${className || ''} shadow-sm cursor-pointer
                        ${full ? "w-full" : "w-full md:w-auto"}
            `}
        >
            {title}
        </button>
    )
}

interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

export function DeleteButton({ onClick, disabled }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="text-lg p-1.5 cursor-pointer text-gray-500 hover:text-red-500 font-medium transition-colors"
        >
            <HiOutlineTrash />
        </button>
    );
}

export function EditButton({ onClick, disabled }: ButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="text-base p-1.5 cursor-pointer text-gray-500 hover:text-primary font-medium transition-colors"
        >
            <FiEdit2 />
        </button>
    );
}