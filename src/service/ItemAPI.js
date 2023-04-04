import axios from "axios"

export default {
    save: async function(id, item) {
        const response = await axios.put(`/api/item/${id}`, item)
        return response.data
    },

    findItems: async function(params) {
        const response = await axios.get(`/api/item`, {
            params: params
          })
        return response.data
    }
}