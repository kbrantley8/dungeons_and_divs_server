const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    party_id: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        required: true
    }
}, {collection: 'messages'})

mongoose.model('Message', messageSchema)