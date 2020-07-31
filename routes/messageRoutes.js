const express = require('express')
const mongoose = require('mongoose')
const Message = mongoose.model('Message')

const router = express.Router()

router.get('/getPartyMessages', async (req, res) => {
    const { party_id } = req.query;

    try {
        var messages = await Message.find({ 'party_id': party_id }).sort({ date_created: 1 });

        var arr = [];
        messages.forEach(function(val, ind) {
            arr.push({
                id: val._id,
                text: val.text,
                user_id: val.user_id,
                party_id: val.party_id,
                date_created: val.date_created
            })
        })

        res.status(200).send(arr)

    } catch (e) {
        return res.send({error: e.message})
    }
})

router.post('/createMessage', async (req, res) => {
    const { text, user_id, party_id, date_created } = req.body;

    try {
        var dat = new Date();
        const message = new Message({ text, user_id, party_id, 'date_created': dat });

        await message.save()

        res.status(200).send({
            id: message._id,
            text: message.text,
            user_id: message.user_id,
            party_id: message.party_id,
            date_created: message.date_created
        })

    } catch (e) {
        return res.status(422).send({error: e.message})
    }
})

router.delete('/deleteMessage', async (req, res) => {

    const { message_id } = req.body;

    try {
        var message = await Message.deleteOne({ '_id': message_id }, async function (err, doc) { 
            if (!doc.deletedCount) {
                return res.status(404).send({error: "Could not find the specified message. Please try again."})
            } else {
                return res.status(200).send(true)
            }
        })

    } catch (e) {
        res.send({error: e.message})
    }
})

module.exports = router;