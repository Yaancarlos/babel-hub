import {FaChevronLeft} from "react-icons/fa";

interface Props {
    onClick?: () => void;
}

function ButtonChevronBack({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer bg-transparent hover:bg-gray-100 text-custom-black transition-colors  rounded-full p-2"
        >
            <FaChevronLeft />
        </button>
    );
}

export default ButtonChevronBack;