export function NotFound({ title } : { title: string }) {
    return (
        <div className="p-5 text-gray-500 justify-center w-full flex items-center h-full">
            <div className="text-center">
                <p className="text-primary font-bold mb-2 text-2xl sm:text-3xl lg:text-4xl">404</p>
                <p className="border px-5 py-2 md:text-base text-sm rounded-md border-dashed border-primary bg-primary-shadow text-primary font-semibold">{title}</p>
            </div>
        </div>
    )
}