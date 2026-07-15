import logo from "../../assets/images/logo.png"

export default function BlockUi() {
    return (
        <div className="h-dvh flex flex-col items-start justify-between bg-page">
            <div className="pl-5 md:pl-10 pt-5 md:pt-10">
                <div className="max-w-12 md:max-w-16">
                    <img
                        className="w-full"
                        src={logo}
                        alt="logo"
                    />
                </div>
            </div>

            <div className="p-5 md:p-10">
                <div className="flex flex-col gap-5">
                    <p className="text-primary font-bold text-base lg:text-lg">503</p>

                    <div className="">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-custom-black mb-4">
                            Estamos haciendo cambios
                        </h1>
                        <p className="text-gray-500 mb-8 text-sm md:text-base">
                            Estamos realizando mejoras en la plataforma. Volveremos a estar disponibles en breve, gracias por tu paciencia.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 border-t-gray-200 w-full flex justify-end px-5 py-10">
                <div className="flex gap-5 items-center">
                    <button
                        disabled={true}
                        className="text-custom-black cursor-pointer text-xs md:text-sm"
                    >
                        Contactanos
                    </button>
                    <button
                        disabled={true}
                        className="text-custom-black cursor-pointer text-xs md:text-sm"
                    >
                        Estado
                    </button>
                </div>
            </div>
        </div>
    )
}