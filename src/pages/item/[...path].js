import Navbar from 'browser/components/navbar'
import LineGraph from "browser/components/line-graph"
import { getServerSession } from "next-auth/next"
import ItemService from 'browser/service/ItemService'
import useItem from "browser/state/item"
import { useEffect } from 'react';


export default function Page({ initialItem, user }) {

    const { item, syncState, updateItem, saveItem } = useItem((state) => state)

    useEffect(() => {
        syncState({
          item: {
            alarm: initialItem.alarm,
            available: initialItem.available,
            availableAt: initialItem.availableAt,
            id: initialItem.id,
            image: initialItem.image,
            lastSubmitedAt: initialItem.lastSubmitedAt,
            link: initialItem.link,
            originalPrice: initialItem.originalPrice,
            price: initialItem.price,
            silent: initialItem.silent,
            source: initialItem.source,
            store: initialItem.store,
            threshold: initialItem.threshold,
            title: initialItem.title,
            createdAt: initialItem.createdAt
          }
        })
      }, []);

    const imageStyles = {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "25%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white"
    }

    const handleSubmit = (evt) => {

        evt.preventDefault();
        console.log('A name was submitted: ', item);
        saveItem(item.id, item)
    }

    return (
        <>
            <div className="min-h-full">
                <Navbar user={user} />

                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
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
                                </div>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <p className="text-gray-400 font-light text-xs text-center">
                                    {item.store}
                                </p>
                                <LineGraph {...initialItem} />
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3 mb-6">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Titulo
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="title" name="title" type="text" placeholder="Jane" 
                                                value={item.title} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full px-3 mb-6">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Imagen
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="image" name="image" type="text" placeholder="Jane" 
                                                value={item.image}  onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full px-3 mb-6">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Link
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="link" name="link" type="text" placeholder="Jane" 
                                                value={item.link} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full px-3 mb-6">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Store
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="store" name="store" type="text" placeholder="Jane" 
                                                value={item.store} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Original Price
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="original-price" name="originalPrice" type="text" 
                                                value={item.originalPrice} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                                Current Price
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="price" name="price" type="text" 
                                                value={item.price} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                                Threshold
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="threshold" name="threshold" type="text" 
                                                value={item.threshold} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                            <input className="mr-2 leading-tight" type="checkbox" name="alarm" 
                                                checked={item.alarm} onChange={(evt) => updateItem(evt.target.name, evt.target.checked)} />
                                            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-600">Alarm</label>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <input className="mr-2 leading-tight" type="checkbox" name="available"
                                            checked={item.available} onChange={(evt) => updateItem(evt.target.name, evt.target.checked)} />
                                            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-600">Available</label>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <input className="mr-2 leading-tight" type="checkbox"  name="silent"
                                            checked={item.silent} onChange={(evt) => updateItem(evt.target.name, evt.target.checked)} />
                                            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-600">Silent</label>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                Created
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="created-at" type="text" name="createdAt" value={item.createdAt} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                                Available
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="available-at" type="text" name="availableAt" value={item.availableAt} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                                Submitted
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="submited-at" type="text" name="lastSubmitedAt" value={item.lastSubmitedAt} onChange={(evt) => updateItem(evt.target.name, evt.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const session = await getServerSession(
        req,
        res
    )

    if (!session || !session.user) {
        return {
            redirect: { destination: "/signin" },
        };
    }

    const { path } = query
    const item = await ItemService.findOne({
        source: path[0],
        id: path[1]
    })

    console.log(item)

    return {
        props: {
            user: session.user,
            initialItem: item
        }
    };
}