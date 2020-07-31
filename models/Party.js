const mongoose = require('mongoose')

const partySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        type: Array,
        of: String,
        required: false,
        default: []
    },
    owner_id: {
        type: String,
        required: true
    }
}, {collection: 'party'})

mongoose.model('Party', partySchema)