import React, {useState, useRef, useEffect, Fragment} from "react";
import { HiDotsVertical } from "react-icons/hi";

export interface MenuOption {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    isDanger?: boolean;
}

interface InteractiveHomeListProps {
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
    avatarText: string;
    title: React.ReactNode;
    subtitle: React.ReactNode;
    key?: string;
    menuOptions?: MenuOption[];
}

export function InteractiveHomeList({ isActive, key, onClick, avatarText, title, disabled, subtitle, menuOptions }: InteractiveHomeListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen) {
            const clickY = e.clientY;
            const windowHeight = window.innerHeight;
            setMenuPosition(windowHeight - clickY < 250 ? 'top' : 'bottom');
        }
        setIsOpen(!isOpen);
    };

    return (
        <div
            key={key}
            className={`w-full group px-2 xl:px-3 py-4 2xl:p-4 relative rounded-xl transition-colors flex items-center justify-between gap-2 2xl:gap-3 border ${
                isActive ? 'bg-primary-shadow border-primary-shadow' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
            }`}
        >
            <button disabled={disabled} onClick={onClick} className="flex items-center cursor-pointer text-left gap-2 w-full">
                <div className={`w-10 h-10 shrink-0 rounded-full flex uppercase items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-primary text-white' : 'bg-primary-shadow text-primary'
                }`}>
                    {avatarText}
                </div>
                <div className="max-w-full lg:max-w-28 2xl:max-w-36 overflow-hidden">
                    <h3 className={`font-bold text-base truncate ${isActive ? 'text-primary-900' : 'text-custom-black'}`}>
                        {title}
                    </h3>
                    <p className="text-gray-500 text-xs truncate">
                        {subtitle}
                    </p>
                </div>
            </button>

            {menuOptions && menuOptions.length > 0 && (
                <div ref={ref}>
                    <button
                        onClick={handleToggleMenu}
                        className="hover:bg-gray-100 cursor-pointer p-1.5 text-custom-black text-sm xl:opacity-0 xl:group-hover:opacity-100 transition-opacity md:text-base rounded-full"
                    >
                        <HiDotsVertical />
                    </button>

                    {isOpen && (
                        <ul className={`absolute z-50 w-48 h-fit p-2 text-sm md:text-base font-semibold right-4 bg-white text-custom-black shadow-lg border border-gray-100 rounded-xl ${
                            menuPosition === 'top' ? 'bottom-12' : 'top-12'
                        }`}>
                            {menuOptions.map((opt, idx) => (
                                <Fragment key={idx}>
                                    {opt.label === "SEPARATOR" ? (
                                        <hr className="border border-gray-100 rounded-xl my-2" />
                                    ) : (
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    opt.onClick?.();
                                                }}
                                                disabled={opt.disabled}
                                                className={`p-2 w-full text-left cursor-pointer rounded-xl ${
                                                    opt.isDanger ? "hover:bg-red-shadow text-red-error" : "hover:bg-gray-100"
                                                } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    )}
                                </Fragment>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}