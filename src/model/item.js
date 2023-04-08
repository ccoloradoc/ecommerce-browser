const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
	id: String,
	title: String,
	originalPrice: Number,
	price: Number,
	image: String,
	link: String,
	source: String,		/* which scheduled job create the item? */
	store: String,		/* store where item is sell?  */
	available: Boolean,	/* is item listed in search? */
	fileId: String,
	messageId: String,
	chatId: String,
	alarm: Boolean,   	/* Should we monitor the item? */
	silent: Boolean,	/* Should we notify the next time?  */
	threshold: Number,
	availableAt: Date,
	lastSubmitedAt: Date,
	historical: Array
}, {
	timestamps: true
});

let Item

if(mongoose.models && mongoose.models.Item) {
	Item = mongoose.models.Item
} else {
	Item = mongoose.model('Item', itemSchema)
}

export default Item