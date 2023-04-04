import Item from 'browser/model/item'
import dbConnect from 'browser/model/dbConnect'

export default {
    findStores: async function () {
        await dbConnect()
        const sources = await Item.collection.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ])
        .toArray()

        return JSON.parse(
            JSON.stringify(
                sources.map(item => { return { name: item._id, count: item.count } })
            )
        )
    },

    findOne: async function (query) {
        const item = await Item.findOne({ 
            ...query
        })
        return JSON.parse(
            JSON.stringify(
                item
            )
        )
    },

    findItems: async function (query) {
        const items = await Item.find({ 
            ...query,
            source: { 
                $regex : new RegExp(query.source, "i") 
            } 
        })
        .sort({price: 1})

        return JSON.parse(
            JSON.stringify(
                items.map((doc) => {
                    return doc.toObject()
                })
            )
        )
    },

    save: async function(id, item) {
        const ack = await Item.updateOne({
            id: id
        }, {
            $set: {
                ...item
            }
        }, {
            upsert: false
        })

        if(ack.modifiedCount == 1) {
            return await Item.findOne({ id: id })
        }
    }
}