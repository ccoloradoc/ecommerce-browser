import { useSession } from "next-auth/react"
import useStore from "browser/state/store"
import moment from "moment-timezone"

moment.locale('es-mx');

function BellIcon({ on }) {
    if (on) {
        return (
            <svg fill="none" value={on} className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
            </svg>
        )
    }

    return (
        <svg fill="none" value={on} className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"></path>
        </svg>
    )
}

function Availability({ available }) {
    const availableClass = available ? 'bg-green-50 p-0.5 border-green-500 border text-green-700' : 'bg-red-50 p-0.5 border-red-500 border text-red-700'
    return (
        <span className={`uppercase text-xs rounded font-medium select-none pl-3 pr-3 ${availableClass}`}>
            {available ? 'available' : 'no stock'}
        </span>
    )
}

export default function Card({ item }) {
    const { data: session } = useSession()
    const { saveItem, updateItem } = useStore((state) => state)
    const imageStyles = {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "60%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white"
    }
    const isLongTitle = item.title.length > 35
    const title = item.title.substring(0, isLongTitle ? 35 : item.title.length) + (isLongTitle ? '...' : '')
    const availableAtText = moment(item.availableAt).tz('America/Mexico_City').format("Do [de] MMMM [a las] h:mmA")
    const lastSubmitedAtText = moment(item.lastSubmitedAt).tz('America/Mexico_City').format("Do [de] MMMM [a las] h:mmA")

    return (
        <div className="bg-white shadow rounded mb-3">
            <div style={imageStyles} className="h-96 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center">
                <div className="flex justify-between">
                    <a className="text-black hover:text-blue-500" href={item.link} target="_blank">
                        <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
                        </svg>
                    </a>
                    <a className="text-black hover:text-blue-500" onClick={() => saveItem(item.id, { alarm: !item.alarm })}>
                        <BellIcon on={item.alarm} />
                    </a>
                </div>
                <div>
                    <Availability available={item.available} />
                </div>
            </div>
            <div className="p-4 flex flex-col items-center">
                <p className="text-gray-400 font-light text-xs text-center">
                    {item.store}
                </p>
                <h1 className="text-gray-800 text-center mt-1">
                    {title}
                </h1>
                <p className="text-center text-gray-800 mt-1">
                    <span className={item.price === item.originalPrice ? "hidden" : "line-through text-gray-500 mr-4"}>${item.originalPrice}</span>
                    ${item.price}
                </p>
                <div className="inline-flex items-center mt-2">
                    {/* <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">
                        {item.threshold}
                    </div> */}
                    <input type="text" name="price" id="price" 
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00"
                        value={item.threshold} 
                        onChange={(ev) => updateItem(item.id, { threshold: ev.target.value})}
                        />
                    <button className="bg-white rounded-r border text-gray-600 ml-4 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
                        onClick={(ev) => saveItem(item.id, { threshold: item.threshold })}>
                        <svg fill="none" className="h-6 w-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                        </svg>
                    </button>
                </div>
                <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center">
                    Edit
                    <svg fill="none" className="h-6 w-6 ml-2" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                    </svg>
                </button>
                <div className="flex justify-between w-full mt-4">
                    <div className="flex items-center text-gray-500">
                        <p className="text-gray-400 font-light text-xs text-center">
                            <span className="font-semibold">Available At: </span> {availableAtText}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 font-light text-xs text-center">
                            <span className="font-semibold">Submitted At: </span> {lastSubmitedAtText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}