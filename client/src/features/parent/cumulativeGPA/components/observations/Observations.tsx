import {BiCommentDetail} from "react-icons/bi";

export function Observations() {
    return (
        <div className="flex flex-col items-center justify-center p-5 xl:p-12 w-full border-x border-b border-dashed border-gray-300 rounded-b-xl">
            <div className="mb-4">
                <BiCommentDetail className="md:size-10 size-6 text-primary"/>
            </div>

            <h3 className="text-custom-black font-bold text-base mb-2 tracking-wide text-center">
                Sin observaciones
            </h3>

            <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed font-normal">
                Aquí aparecerán los comentarios y reconocimientos que compartan los docentes.
            </p>

        </div>
    );
}