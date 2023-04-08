import Item from 'browser/model/item'
import dbConnect from 'browser/model/dbConnect'

function cleanDate(date) {
    return JSON.stringify(date).replace(/\"/g, "")
}

export default {
    findStores: async function () {
        await dbConnect()
        const sources = await Item.collection.aggregate([
            {
                $match: { 
                    "availableAt": {
                        $gte: new Date(2022, 12, 1)
                    }
                }
            },
            {
                $group: {
                    _id: '$source',
                    active: { $max: '$availableAt'},
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ])
        .toArray()

        return JSON.parse(
            JSON.stringify(
                sources.map(item => { return { name: item._id, count: item.count, active: item.active } })
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
            },
            availableAt: {
                $gte: new Date(2022, 12, 1), 
            }
        })
        .sort({price: 1})

        let flatItems = []
        for(var i = 0; i < items.length; i++) {
            let item = items[i]
            let flatItem = {
                id: item.id,
                source: item.source,
                available: item.available,
                createdAt: cleanDate(item.createdAt),
                image: item.image,
                link: item.link,
                price: item.price,
                title: item.title + '',
                store: item.store,
                alarm: item.alarm,
                availableAt: cleanDate(item.availableAt),
                threshold: item.threshold || 0,
                lastSubmitedAt: cleanDate(item.lastSubmitedAt),
                originalPrice: item.originalPrice,
                silent: item.silent,
                historical: []
            }
            if(item.historical) {
                for(var j = 0; j < item.historical.length; j++) {
                    let pair = item.historical[j]
                    flatItem.historical.push({
                        date: cleanDate(pair.date),
                        value: pair.value
                    })
                }
            }
            flatItems.push(flatItem)
        }

        return flatItems;
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