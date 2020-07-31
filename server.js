require('./models/User')
require('./models/Party')
require('./models/Message')
require('./models/CharacterSheet')

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const partyRoutes = require('./routes/partyRoutes')
const messageRoutes = require('./routes/messageRoutes')
const characterSheetRoutes = require('./routes/characterSheetRoutes')
const bodyParser = require('body-parser')

const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoutes)
app.use(partyRoutes)
app.use(messageRoutes)
app.use(characterSheetRoutes)

var mongo_username = process.env.MONGO_USERNAME;
var mongo_password = process.env.MONGO_PASSWORD;

try {
    const credentials = require('./credentials/mongo-auth.json');
    mongo_username = credentials.username;
    mongo_password = credentials.password;
} catch (e) {
    console.log(e)
}

var connectionString = 'mongodb+srv://'+ mongo_username + ':' + mongo_password + '@cluster0.mqn3k.mongodb.net/Dungeons_and_Divs?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})


mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
})
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err)
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port 3000`)
})