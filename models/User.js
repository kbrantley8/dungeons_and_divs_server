const mongoose = require('mongoose')

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    }, 
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return emailRegex.test(v)
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    account_type: {
        type: Number,
        required: false,
        default: 0
    },
    party_id: {
        type: Map,
        required: false,
        default: {}
    },
    bio: {
        type: String,
        required: false
    }
}, {collection: 'users'})

userSchema.methods.comparePassword = function(enteredPassword) {
    const user = this
    return new Promise((resolve, reject) => {
        if (enteredPassword != user.password) {
            return reject("Passwords do not match")
        } else {
            resolve(true)
        }
    })  
}

mongoose.model('User', userSchema)