import { useSession } from "next-auth/react"
import LineGraph from "browser/components/line-graph"
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

function Addendum({ price, originalPrice, threshold }) {
    if (price < threshold) {
        return (
            <span className={`uppercase text-xs rounded font-medium select-none pl-3 pr-3 bg-red-50 p-0.5 border-red-500 border text-red-700`}>
                super deal {Math.ceil(100 - (price * 100 / originalPrice))} %
            </span>
        )
    } else if (price < originalPrice) {
        return (
            <span className={`uppercase text-xs rounded font-medium select-none pl-3 pr-3 bg-orange-50 p-0.5 border-orange-500 border text-orange-700`}>
                discount {Math.ceil(100 - (price * 100 / originalPrice))} %
            </span>
        )
    }

    return (<></>)
}

function CardFooter({ availableAt, lastSubmitedAt, createdAt }) {
    const createdAtText = moment(createdAt).tz('America/Mexico_City').format("Do [de] MMMM 'YY [a las] h:mmA")
    const availableAtText = moment(availableAt).tz('America/Mexico_City').format("Do [de] MMMM [a las] h:mmA")
    const lastSubmitedAtText = moment(lastSubmitedAt).tz('America/Mexico_City').format("Do [de] MMMM [a las] h:mmA")
    return (
        <div className="w-full mt-4">
            <p className="text-gray-400 font-light text-xs">
                <span className="font-semibold">Created: </span> {createdAtText}
            </p>
            <p className="text-gray-400 font-light text-xs">
                <span className="font-semibold">Available At: </span> {availableAtText}
            </p>

            <p className="text-gray-400 font-light text-xs">
                <span className="font-semibold">Submitted At: </span> {lastSubmitedAtText}
            </p>

        </div>
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

    return (
        <div className="bg-white shadow rounded mb-3"
                data-id={item.id}
                data-title={item.title} 
                data-price={item.price} 
                data-original-price={item.originalPrice}>
            <div style={imageStyles} className="h-96 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center">
                <div className="flex justify-between">
                    <a className="text-black hover:text-blue-500" href={item.link} target="_blank">
                        <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
                        </svg>
                    </a>
                    <Availability available={item.available} />
                    <a className="text-black hover:text-blue-500" onClick={() => saveItem(item.id, { alarm: !item.alarm })}>
                        <BellIcon on={item.alarm} />
                    </a>
                </div>
                <div className="flex justify-center">
                    <Addendum {...item} />
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
                    <span className={`block uppercase text-xs rounded font-medium select-none  bg-blue-50 p-1.5 border-blue-500 border text-blue-700 mr-3`}>
                        {Math.ceil(100 - (item.threshold * 100 / item.originalPrice))}%
                    </span>
                    <input type="text" name="price" id="price"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00"
                        value={item.threshold}
                        onChange={(ev) => updateItem(item.id, { threshold: ev.target.value })}
                    />
                    <button className="bg-white rounded-r border text-gray-600 ml-4 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
                        onClick={(ev) => saveItem(item.id, { threshold: item.threshold })}>
                        <svg fill="none" className="h-6 w-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                        </svg>
                    </button>
                </div>
                <LineGraph {...item} />
                <CardFooter {...item} />
            </div>
        </div>
    )
}