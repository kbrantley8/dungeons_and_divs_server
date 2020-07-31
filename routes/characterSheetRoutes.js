const express = require('express')
const mongoose = require('mongoose')
const CharacterSheet = mongoose.model('CharacterSheet')
const User = mongoose.model('User')

const router = express.Router()

router.get('/getCharacterSheet', async (req, res) => {
    const { name, sheet_id } = req.query;

    try {
        var charSheet = await CharacterSheet.findOne({$or:[ { '_id': sheet_id}, { 'name': name } ] }).sort({ date_created: 1 });

        res.status(200).send(charSheet)

    } catch (e) {
        return res.send({error: e.message})
    }
})

router.post('/createCharacterSheet', async (req, res) => {
    const { user_id, date_created, name, race, class_1, class_2, experience_points, strength, dexterity, constitution, intelligence, wisdom, charisma, acrobatics, animal_handling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleight_of_hand, stealth, survival, armor_rating, speed, max_hit_points, current_hit_points, initiative, hit_dice } = req.body;

    try {
        const charSheet = new CharacterSheet({ user_id, date_created, name, race, class_1, class_2, experience_points, strength, dexterity, constitution, intelligence, wisdom, charisma, acrobatics, animal_handling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleight_of_hand, stealth, survival, armor_rating, speed, max_hit_points, current_hit_points, initiative, hit_dice });

        await charSheet.save()

        res.status(200).send(charSheet)

    } catch (e) {
        return res.status(422).send({error: e.message})
    }
})

router.post('/editCharacterSheet', async (req, res) => {
    const { sheet_id, data } = req.body;

    try {
        var charSheet = await CharacterSheet.findOneAndUpdate({ '_id': sheet_id }, data, async function (err, doc) {
            if (!doc) {
                return res.status(404).send({error: "Could not find the specified character sheet. Please try again."})
            }
        })

        res.status(200).send(charSheet)

    } catch (e) {
        return res.status(422).send({error: e.message})
    }
})

router.get('/getUsersCharacterSheet', async (req, res) => {
    const { user_id, email } = req.query;

    try {
        const user = await User.findOne({$or:[ { '_id': user_id}, { 'email': email } ] });

        if (!user) {
            return res.status(404).send({error: "Could not find the specified user. Please try again."})
        }

        var charSheet = await CharacterSheet.find({ 'user_id': user._id }).sort({ date_created: 1 });

        res.status(200).send(charSheet)

    } catch (e) {
        return res.send({error: e.message})
    }
})

router.delete('/deleteCharacterSheet', async (req, res) => {

    const { sheet_id } = req.body;

    try {
        var char_sheet = await CharacterSheet.deleteOne({ '_id': sheet_id}, async function (err, doc) { 
            if (!doc.deletedCount) {
                return res.status(404).send({error: "Could not find the specified character sheet. Please try again."})
            } else {
                return res.status(200).send(true)
            }
        })

    } catch (e) {
        res.send({error: e.message})
    }
})

module.exports = router;