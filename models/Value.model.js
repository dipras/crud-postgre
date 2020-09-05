const {
    INTEGER,
    DATE
} = require('sequelize')
const db = require('../db')

const Value = db.define('Value', {
    account_id: {
        type: INTEGER
    },
    value1: {
        type: INTEGER
    },
    value2: {
        type: INTEGER
    },
    DeletedAt: {
        type: DATE,
        defaultValue: null
    }
}, {
    timestamps: true
})

module.exports = Value