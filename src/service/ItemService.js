import Item from 'browser/model/item'
import dbConnect from 'browser/model/dbConnect'

function cleanDate(date) {
    if (date == undefined) {
        return ""
    }
    return JSON.stringify(date).replace(/\"/g, "")
}

export default {
    findStores: async function () {
        await dbConnect()
        const sources = await Item.collection.aggregate([
            {
                $match: {
                    "createdAt": {
                        $gte: new Date(2022, 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: '$source',
                    lastAvailableAt: { $max: '$availableAt' },
                    availableItems: { $sum: { "$cond": ["$available", 1, 0] } },
                    alarmItems: { $sum: { "$cond": ["$alarm", 1, 0] } },
                    monitoredItems: { $sum: { "$cond": [{ $and: ["$alarm", "$available"] }, 1, 0] } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { monitoredItems: -1 } }
        ])
            .toArray()

        return JSON.parse(
            JSON.stringify(
                sources.map(item => {
                    return {
                        name: item._id,
                        count: item.count,
                        lastAvailableAt: item.lastAvailableAt,
                        availableItems: item.availableItems,
                        alarmItems: item.alarmItems,
                        monitoredItems: item.monitoredItems
                    }
                })
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
        const filter = {}
        if(query.hasOwnProperty('source')) {
            filter['source'] = {
                $regex: new RegExp(query.source, "i")
            }
        }
        if(query.hasOwnProperty('createdAt')) {
            filter['createdAt'] = query.createdAt
        } else if(query.hasOwnProperty('days')) {
            const today = new Date(); 
            today.setDate(today.getDate() - query.days);
            filter['createdAt'] = {
                $gte: today
            }
        } else {
            filter['createdAt'] = {
                $gte:  new Date(2022, 1, 1)
            }
        }
        console.log('Query', filter)
        const items = await Item.find({ 
            ...filter
        })
        .sort({ price: 1 })

        let flatItems = []
        for (var i = 0; i < items.length; i++) {
            let item = items[i]
            if (item.alarm == undefined) {
                console.log(item)
            }
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
                alarm: item.alarm || false,
                availableAt: cleanDate(item.availableAt),
                threshold: item.threshold || 0,
                lastSubmitedAt: cleanDate(item.lastSubmitedAt || new Date()),
                originalPrice: item.originalPrice,
                silent: item.silent,
                historical: [],
                tags: item.tags
            }
            if (item.historical) {
                for (var j = 0; j < item.historical.length; j++) {
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

    save: async function (id, item) {
        const ack = await Item.updateOne({
            id: id
        }, {
            $set: {
                ...item
            }
        }, {
            upsert: false
        })

        if (ack.modifiedCount == 1) {
            return await Item.findOne({ id: id })
        }
    }
}