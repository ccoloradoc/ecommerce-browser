import moment from "moment-timezone"

// moment.locale('es-m//x');

export default function StackItem({ title, dek, link, active }) {
    const availableAtText = moment(active).tz('America/Mexico_City').format("YYYY-MM-DD HH:mm:ss")
    return (

        <li key={title} className="border-b-2 border-gray-100">
            <div className={`py-5 px-4 flex justify-between border-l-4 border-transparent bg-transparent hover:border-green-400 hover:bg-gray-200`}>
                <div className="sm:pl-4 pr-8 flex sm:items-center">
                    {/* <img src={store.picture} alt="" className="mr-3 w-8 sm:w-12 h-8 sm:h-12 rounded-full" /> */}
                    <div className="space-y-1">
                        <p className="text-base text-gray-700 font-bold tracking-wide">{title}</p>
                        <p className="text-sm text-gray-500 font-medium">{dek}</p>
                        <p className="text-gray-400 font-light text-xs">
                            <span className="font-semibold">Last Fetch: </span> {availableAtText}
                        </p>
                    </div>
                </div>
                <div className="pr-4 flex flex-col justify-between items-end">
                    <a href={link} className="text-sm text-gray-500 font-semibold hover:underline hover:text-gray-700">
                        <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </li>
    )
}