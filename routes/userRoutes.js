const express = require('express')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const router = express.Router()

router.get('/users', async (req, res) => {
    const users = await User.find().sort({ email: 1 })

    var ret_users = [];
    users.forEach(function(val, ind) {
        const user = {
            id: val._id,
            first_name: val.first_name,
            last_name: val.last_name,
            email: val.email,
            password: val.password,
            account_type: val.account_type,
            party_id: val.party_id,
            bio: val.bio
        }
        ret_users.push(user);
    })
    res.status(200).send(ret_users)
});

router.get('/getUser', async (req, res) => {
    const { email, user_id } = req.query;

    try {
        const user = await User.findOne({$or:[ { '_id': user_id}, { 'email': email } ] });

        if (!user) {
            return res.status(404).send({error: "Could not find the specified user. Please try again."})
        }

        res.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            account_type: user.account_type,
            party_id: user.party_id,
            bio: user.bio
        })

    } catch (e) {
        return res.send({error: e.message})
    }
})

router.post('/createUser', async (req, res) => {
    const {first_name, last_name, email, password, account_type, party_id, bio } = req.body;

    try {
        const user = new User({first_name, last_name, email, password, account_type, party_id, bio});

        await user.save(function(err) {
            if ( err && err.code === 11000 ) {
                return res.status(409).send({error: "Email already exists. Try logging in!"})
            }
        })

        res.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            account_type: user.account_type,
            party_id: user.party_id,
            bio: user.bio
        })

    } catch (e) {
        return res.status(422).send({error: e.message})
    }
})

router.post('/editUser', async (req, res) => {

    const { user_id, data } = req.body;

    try {
        var user = await User.findOneAndUpdate({ '_id': user_id }, data, async function (err, doc) {
            if (!doc) {
                return res.status(404).send({error: "Could not find the specified user. Please try again."})
            }
        })  

        res.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            account_type: user.account_type,
            party_id: user.party_id,
            bio: user.bio
        })
    } catch (e) {
        res.send({error: e.message})
    }
})

router.delete('/deleteUser', async (req, res) => {

    const { email, user_id } = req.body;

    try {
        var user = await User.deleteOne({$or:[ { '_id': user_id}, { 'email': email } ] }, async function (err, doc) { 
            if (!doc.deletedCount) {
                return res.status(404).send({error: "Could not find the specified user. Please try again."})
            } else {
                return res.status(200).send(true)
            }
        })

    } catch (e) {
        res.send({error: e.message})
    }
})

router.get('/loginUser', async (req, res) => {
    const { user_id, email, password } = req.query;

    try {
        const user = await User.findOne({$or:[ { '_id': user_id}, { 'email': email } ] });

        if (!user) {
            return res.status(404).send({error: "Could not find the specified user. Please try again."})
        }

        if (password == user.password) {
            res.status(200).send({
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                account_type: user.account_type,
                party_id: user.party_id,
                bio: user.bio
            })
        } else {
            res.status(400).send({ error: "Passwords do not match! Please try again!" })
        }

    } catch (e) {
        return res.send({error: e.message})
    }
})

module.exports = router;