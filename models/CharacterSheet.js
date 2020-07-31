const mongoose = require('mongoose')

const characterSheetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    race: {
        type: String,
        required: true
    },
    class_1: {
        type: Map,
        required: true
    },
    class_2: {
        type: Map,
        required: false
    },
    experience_points: {
        type: Number,
        required: false,
        default: 0
    },
    strength: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    dexterity: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    constitution: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    intelligence: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    wisdom: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    charisma: {
        type: Map,
        required: false,
        default: {
            'modifier': 0,
            'score': 0
        }
    },
    acrobatics: {
        type: Number,
        required: false,
        default: 0
    },
    animal_handling: {
        type: Number,
        required: false,
        default: 0
    },
    arcana: {
        type: Number,
        required: false,
        default: 0
    },
    athletics: {
        type: Number,
        required: false,
        default: 0
    },
    deception: {
        type: Number,
        required: false,
        default: 0
    },
    history: {
        type: Number,
        required: false,
        default: 0
    },
    insight: {
        type: Number,
        required: false,
        default: 0
    },
    intimidation: {
        type: Number,
        required: false,
        default: 0
    },
    investigation: {
        type: Number,
        required: false,
        default: 0
    },
    medicine: {
        type: Number,
        required: false,
        default: 0
    },
    nature: {
        type: Number,
        required: false,
        default: 0
    },
    perception: {
        type: Number,
        required: false,
        default: 0
    },
    performance: {
        type: Number,
        required: false,
        default: 0
    },
    persuasion: {
        type: Number,
        required: false,
        default: 0
    },
    religion: {
        type: Number,
        required: false,
        default: 0
    },
    sleight_of_hand: {
        type: Number,
        required: false,
        default: 0
    },
    stealth: {
        type: Number,
        required: false,
        default: 0
    },
    survival: {
        type: Number,
        required: false,
        default: 0
    },
    armor_rating: {
        type: Number,
        required: false,
        default: 0
    },
    speed: {
        type: Number,
        required: false,
        default: 0
    },
    max_hit_points: {
        type: Number,
        required: false,
        default: 0 
    },
    current_hit_points: {
        type: Number,
        required: false,
        default: 0
    },
    initiative: {
        type: Number,
        required: false,
        default: 0
    },
    hit_dice: {
        type: Number,
        required: false,
        default: 0
    }
}, {collection: 'character_sheets'})

mongoose.model('CharacterSheet', characterSheetSchema)