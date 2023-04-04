import { create } from 'zustand'
import ItemAPI from 'browser/service/ItemAPI'

let filter = {
    text: '',
    available: true,
    alarm: true,
    deal: false,
    super: false,
    price: true
}

let initialState = {
    filter: filter,
    stores: [],
    selectedStore: '',
    items: [],
    allItems: []
}

function filterItems(allItems, filters) {
    let items =  allItems
        .filter(item =>  item.available == filters.available)
        .filter(item =>  item.alarm == filters.alarm)
        .filter(item =>  item.title.toLowerCase().indexOf(filters.text.toLowerCase()) >= 0)

    if(filters.super) { 
        items = items.filter(item => item.price < item.threshold)
    }

    return items
}

// TODO: Improve!!!
function update(items, id, item) {
    let pos = -1
    items.forEach((element, index) => {
        if(element.id == id) {
            pos = index
        }
    });
    if(pos >= 0) {
        items[pos] = {
            ...items[pos],
            ...item
        }
    }
    return items
}

const storeStore = create((set, get) => ({
    ...initialState,
    updateFilter: async (params) => { 
        set(state => ({
            ...state,
            filter: {
                ...state.filter,
                ...params
            },
            items: filterItems(state.allItems, {
                ...state.filter,
                ...params
            })
        }))
    },
    syncState: async (params) => { 
        set(state => ({
            ...state,
            ...params
        }))
    },
    saveItem: async (id, item) => {
        const savedItem = await ItemAPI.save(id, item)
        const allItems = await ItemAPI.findItems({ source: savedItem.source})
        set(state => ({
            ...state,
            items: filterItems(allItems, state.filter),
            allItems: allItems
        }))
    },
    updateItem: async (id, item) => {
        console.log('update', id, item)
        set(state => ({
            ...state,
            items: update(state.items, id, item)
        }))
    }
}))

export default storeStore
