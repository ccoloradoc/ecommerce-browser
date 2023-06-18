import { create } from 'zustand'
import ItemAPI from 'browser/service/ItemAPI'

let initialState = {
    item: {

    }
}

const storeItem = create((set, get) => ({
    ...initialState,
    syncState: async (params) => { 
        set(state => ({
            ...state,
            ...params
        }))
    },
    updateItem: async (field, value) => {
        console.log('update', field, value)
        set(state => ({
            ...state,
            item: {
                ...state.item,
                [field]: value
            }
        }))
    },
    saveItem: async (id, item) => {
        const savedItem = await ItemAPI.save(id, item)
        console.log('saveItem', savedItem)
    },
}))

export default storeItem
