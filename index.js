const express = require('express')
const db = require('./db')
const router = require('./routes')

const app = express()
db.authenticate()
    .then(() => console.log('database connected!'))
    .catch(err => console.log(err))


app.use(express.json())
app.use('/', router)

app.listen(3000, () => console.log('server is running at port 3000'))