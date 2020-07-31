const express = require('express')
const mongoose = require('mongoose')
const Party = mongoose.model('Party')
const User = mongoose.model('User')

const router = express.Router()

router.get('/parties', async (req, res) => {
    const parties = await Party.find().sort({ name: 1 })

    var ret_users = [];
    parties.forEach(function(val, ind) {
        const party = {
            id: val._id,
            name: val.name,
            members: val.members,
            owner_id: val.owner_id
        }
        ret_users.push(party);
    })
    res.status(200).send(ret_users)
});

router.get('/getParty', async (req, res) => {
    const { party_id, name } = req.query;

    try {
        var party = await Party.findOne({$or:[ { '_id': party_id}, { 'name': name } ] } );

        if (!party) {
            return res.status(404).send({error: "Could not find the specified party. Please try again."})
        }

        res.status(200).send({
            id: party._id,
            name: party.name,
            members: party.members,
            owner_id: party.owner_id
        })

    } catch (e) {
        return res.send({error: e.message})
    }
})

router.post('/createParty', async (req, res) => {
    const { name, members, owner_id } = req.body;

    try {
        const party = new Party({ name, members, owner_id });

        await party.save()

        res.status(200).send({
            id: party._id,
            name: party.name,
            members: party.members,
            owner_id: party.owner_id
        })

    } catch (e) {
        return res.status(422).send({error: e.message})
    }
})

router.post('/editParty', async (req, res) => {

    const { party_id, data } = req.body;

    try {
        var party = await Party.findOneAndUpdate({ '_id': party_id }, data, async function (err, doc) {
            if (!doc) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            }
        })

        res.status(200).send({
            id: party._id,
            name: party.name,
            members: party.members,
            owner_id: party.owner_id
        })
    } catch (e) {
        res.send({error: e.message})
    }
})

router.delete('/deleteParty', async (req, res) => {

    const { party_id, party_name } = req.body;

    try {
        var party = await Party.deleteOne({$or:[ { '_id': party_id }, { 'name': party_name } ] }, async function (err, doc) { 
            if (!doc.deletedCount) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            } else {
                return res.status(200).send(true)
            }
        })

    } catch (e) {
        res.send({error: e.message})
    }
})

router.post('/addMember', async (req, res) => {

    const { party_id, party_name, data } = req.body; //should be of the form ['id', 'id', 'id']

    try {
        var party = await Party.findOne({$or:[ { '_id': party_id }, { 'name': party_name } ] }, function(err, doc) {
            if (err) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            }
            return {
                id: doc._id,
                name: doc.name,
                members: doc.members,
                owner_id: doc.owner_id
            }
        });

        let arr = party.members;
        data.forEach(function(val, ind) {
            if (!arr.includes(val)) {
                arr.push(val)
            }
        })

        var party = await Party.findOneAndUpdate({ $or: [{ '_id': party_id}, { 'name': party_name }] }, { members: arr }, async function (err, doc) {
            if (!doc) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            }
        })

        res.status(200).send({
            id: party._id,
            name: party.name,
            members: party.members,
            owner_id: party.owner_id
        })

    } catch (e) {
        res.send({error: e.message})
    }
})

router.post('/removeMember', async (req, res) => {

    const { party_id, party_name, data } = req.body; //should be of the form ['id', 'id', 'id']

    try {
        var party = await Party.findOne({$or:[ { '_id': party_id }, { 'name': party_name } ] }, function(err, doc) {
            if (err) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            }
            return {
                id: doc._id,
                name: doc.name,
                members: doc.members,
                owner_id: doc.owner_id
            }
        });

        let arr = party.members;

        if (!data.every(o => arr.includes(o))) {
            return res.status(400).send({error: "That user is not a member of the " + party.name + " party!"})
        }

        var new_arr = [];

        arr.forEach(function(val, ind) {
            if (!data.includes(val)) {
                new_arr.push(val)
            }
        })

        var new_party = await Party.findOneAndUpdate({ $or: [{ '_id': party_id}, { 'name': party_name }] }, { members: new_arr }, async function (err, doc) {
            if (!doc) {
                return res.status(404).send({error: "Could not find the specified party. Please try again."})
            }
        })

        res.status(200).send({
            id: new_party._id,
            name: new_party.name,
            members: new_party.members,
            owner_id: new_party.owner_id
        })
        
    } catch (e) {
        res.send({error: e.message})
    }
})

router.get('/getPartyMembers', async (req, res) => {
    const { party_id, name } = req.query;

    try {
        var party = await Party.findOne({$or:[ { '_id': party_id}, { 'name': name } ] } );

        if (!party) {
            return res.status(404).send({error: "Could not find the specified party. Please try again."})
        }

        var users = await User.find({'_id': { $in: party.members }})
        var arr = [];
        users.forEach(function(user, ind) {
            arr.push({
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                account_type: user.account_type,
                party_id: user.party_id,
                bio: user.bio
            })
        })
        res.status(200).send(arr)

    } catch (e) {
        return res.send({error: e.message})
    }
})

module.exports = router;