import { useSession } from "next-auth/react"
import LineGraph from "browser/components/line-graph"
import useStore from "browser/state/store"
import moment from "moment-timezone"
import domtoimage from 'dom-to-image';

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
            <span className={`uppercase text-xs rounded font-medium select-none pl-4 pr-4 bg-red-50 p-0.5 border-red-500 border text-red-700`}>
                super deal {Math.ceil(100 - (price * 100 / originalPrice))} %
            </span>
        )
    } else if (price < originalPrice) {
        return (
            <span className={`uppercase text-xs rounded font-medium select-none pl-4 pr-4 bg-orange-50 p-0.5 border-orange-500 border text-orange-700`}>
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
    const { saveItem, updateItem, query } = useStore((state) => state)
    const imageStyles = {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "60%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white"
    }
    const isLongTitle = item.title.length > 35
    const title = item.title.substring(0, isLongTitle ? 35 : item.title.length) + (isLongTitle ? '...' : '')

    const saveImage = (evt, item) => {
        // console.log(evt.currentTarget.parentElement.parentElement.parentElement)
        domtoimage.toPng(evt.currentTarget.parentElement.parentElement.parentElement.childNodes[1])
            .then(function (dataUrl) {
                var a = document.createElement('a');
                a.setAttribute('href', dataUrl);
                a.setAttribute('download', `${item.store}-${item.id}-widget.png`);
                a.click()
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }

    const downloadImage = (evt, item) => {
        var a = document.createElement('a');
        a.setAttribute('href', item.image);
        a.setAttribute('download', `${item.store}-${item.id}.png`);
        a.setAttribute('target', '_blank');
        a.click()
    }

    const copyToClipboard = (evt, item) => {
        let discount = item.price < item.originalPrice ? ` con un descuento de ${100 - Math.floor((item.price * 100) / item.originalPrice)}%` : ''
        let text = `El siguiente producto tiene un precio de $${item.price}${discount} ${item.title} en ${item.source}. \nPuedes encontrarlo en el link: ${item.link}`;
        navigator.clipboard.writeText(text)
            .then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
    }

    let tags = item && item.tags ? item.tags : []
    let pills = tags.map((tag, index) => {
        return (
            <span key={index} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mb-1 rounded-full flex mr-2 text-sm">
                {tag}
            </span>
        )
    })

    return (
        <div className="bg-white shadow rounded mb-3"
            data-id={item.id}
            data-title={item.title}
            data-price={item.price}
            data-original-price={item.originalPrice}>
            <div className="p-4 flex flex-col">
                <div className="flex justify-between">
                    <a className="text-black hover:text-blue-500" href={item.link} target="_blank">
                        <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
                        </svg>
                    </a>
                    <Availability available={item.available} />
                    <a className="text-black hover:text-blue-500" onClick={() => saveItem(item.id, { alarm: !item.alarm }, query)}>
                        <BellIcon on={item.alarm} />
                    </a>
                </div>
            </div>
            <div class="b-content bg-white">
                <div style={imageStyles} className="h-96 w-full bg-gray-200 flex flex-row justify-center p-4 bg-cover bg-center">
                    <div className="flex justify-center items-end">
                        <Addendum {...item} />
                    </div>
                </div>
                <div className="p-4 flex flex-col items-center">
                    <p className="text-gray-400 font-light text-xs text-center">
                        {item.store}
                    </p>
                    <h1 className="text-gray-800 text-center leading-none mt-1">
                        {item.title}
                    </h1>
                    <p className="text-center text-gray-800 mt-4">
                        <span className={item.price === item.originalPrice ? "invisible" : "line-through text-gray-500 mr-4"}>${item.originalPrice}</span>
                        <span className="font-semibold">${item.price}</span>
                        <span className={"text-red-400 ml-4"}>${item.threshold}</span>
                    </p>
                    <LineGraph {...item} />
                    <CardFooter {...item} />
                    <div className="w-full mt-4">
                        <div className="flex flex-wrap items-center">
                            {pills}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col">
                <div className="flex justify-between">
                    <a className="text-black hover:text-blue-500" href={`/item/${item.source}/${item.id}`} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                    </a>
                    <a className="text-black hover:text-blue-500" onClick={(evt) => saveImage(evt, item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                    </a>
                    <a className="text-black hover:text-blue-500" onClick={(evt) => downloadImage(evt, item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </a>
                    <a className="text-black hover:text-blue-500" onClick={(evt) => copyToClipboard(evt, item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}