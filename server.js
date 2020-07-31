// require('./models/User')
// require('./models/Task')
// require('./minutely-updates')

const express = require('express')
const mongoose = require('mongoose')
// const userRoutes = require('./routes/userRoutes')
// const taskRoutes = require('./routes/taskRoutes')
const bodyParser = require('body-parser')

const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(userRoutes)
// app.use(taskRoutes)

const credentials = require('./credentials/mongo-auth.json');
var connectionString = 'mongodb+srv://'+ credentials.username + ':' + credentials.password + '@cluster0.mqn3k.mongodb.net/Dungeons_and_Divs?retryWrites=true&w=majority';

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
    console.log(`Listening on port ${process.env.PORT}`)
})