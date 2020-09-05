const {
    STRING,
    DATE
} = require('sequelize')
const db = require('../db')

const Account = db.define('Account', {
    code: {
        type: STRING
    },
    name: {
        type: STRING
    },
    DeletedAt: {
        type: DATE,
        defaultValue: null
    }
}, {
    timestamps: true
})

module.exports = Account