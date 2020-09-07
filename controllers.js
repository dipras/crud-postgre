const Excel = require('exceljs')
const {
    check,
    validationResult
} = require('express-validator')

const AccountModel = require('./models/Account.model')
const ValueModel = require('./models/Value.model')

const getData = async (showCode = false) => {
    try {
        const accounts = await AccountModel.findAll({
            where: {
                DeletedAt: null
            }
        })
        const values = await ValueModel.findAll()
        let result = [];

        accounts.forEach(acc => {
            let value;
            values.forEach(val => {
                if (val.account_id == acc.id) value = val
            })

            if (value) {
                let data = {
                    name: acc.name,
                    value1: value.value1,
                    value2: value.value2,
                    avg: (value.value1 + value.value2) / 2
                }
                if (showCode) data = {
                    ...data,
                    code: acc.code
                }

                result = [...result, data]
            }
        })

        return result
    } catch (error) {
        return res.send({
            status: 502,
            success: false,
            message: error
        })
    }

}

module.exports = {
    getAll: async (req, res) => {
        const result = await getData(true)
        const value1 = result.map(m => m.value1).reduce((total, num) => total + num)
        const value2 = result.map(m => m.value2).reduce((total, num) => total + num)

        let data = []
        const jumlahDiv = result.length >= 10 ? Math.floor(result.length / 10) : 0
        const sisaDiv = result.length >= 10 ? result.length % 10 : result.length

        for (let index = 0; index <= (jumlahDiv - 1); index++) {
            const localResult = result.slice(index * 10, index * 10 + 10)
            const value1 = localResult.map(m => m.value1).reduce((total, num) => total + num)
            const value2 = localResult.map(m => m.value2).reduce((total, num) => total + num)
            data = [...data, {
                name: jumlahDiv + 1,
                details: [...localResult, {
                    name: "TOTAL",
                    value1,
                    value2,
                    avg: (value1 + value2) / 2
                }]
            }]

        }
        if (sisaDiv) {
            const localResult = result.slice(jumlahDiv * 10)
            const value1 = localResult.map(m => m.value1).reduce((total, num) => total + num)
            const value2 = localResult.map(m => m.value2).reduce((total, num) => total + num)
            data = [...data, {
                name: jumlahDiv + 1,
                details: [...localResult, {
                    name: "TOTAL",
                    value1,
                    value2,
                    avg: (value1 + value2) / 2
                }]
            }]
        }

        data = [...data, {
            name: "GRAND TOTAL",
            value1,
            value2,
            avg: (value1 + value2) / 2
        }]

        res.send({
            code: 200,
            success: true,
            message: "Get Accounts",
            data: data
        })
    },

    excel: async (req, res) => {
        const result = await getData(true)
        const value1 = result.map(m => m.value1).reduce((total, num) => total + num)
        const value2 = result.map(m => m.value2).reduce((total, num) => total + num)
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('');

        // add column headers
        worksheet.columns = [{
                header: 'No',
                key: 'No'
            },
            {
                header: "Account",
                key: "name"
            },
            {
                header: 'Code',
                key: 'code'
            },
            {
                header: 'Value1',
                key: 'value1'
            },
            {
                header: 'Value2',
                key: 'value2'
            },
            {
                header: 'AVG',
                key: 'avg'
            }
        ];


        result.forEach((val, index) => {
            const dataRow = {
                ...val,
                No: index + 1
            }
            worksheet.addRow(dataRow)
            if ((index + 1) % 10 == 0 || index == result.length - 1) {
                const data = (index !== result.length - 1) ? result.slice((index - 9), (index + 1)) : result.slice(result.length - (result.length % 10))
                const value1 = data.map(m => m.value1).reduce((total, num) => total + num)
                const value2 = data.map(m => m.value2).reduce((total, num) => total + num)
                const avg = (value1 + value2) / 2

                const dataRow = {
                    No: "",
                    name: "TOTAL",
                    code: "",
                    value1,
                    value2,
                    avg
                }

                worksheet.addRow(dataRow)
            }
        })
        worksheet.addRow({
            No: "",
            name: "GRAND TOTAL",
            code: "",
            value1,
            value2,
            avg: (value1 + value2) / 2
        })

        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 12 : column.header.length
        })


        res.attachment("test.xlsx")
        workbook.xlsx.write(res)
            .then(function () {
                res.end()
            });
    },

    show: async (req, res) => {
        try {
            const result = await AccountModel.findOne({
                where: {
                    id: req.params.id
                }
            })
            res.send({
                status: 200,
                success: true,
                message: "Get Data",
                data: result
            })
        } catch (error) {
            return res.send({
                status: 502,
                success: false,
                message: error
            })
        }

    },

    store: async (req, res) => {
        await check('code').exists().run(req)
        await check('name').exists().run(req)
        await check('value1').isNumeric().run(req)
        await check('value2').isNumeric().run(req)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            const createdAccount = await AccountModel.create({
                code: req.body.code,
                name: req.body.name
            })
            await ValueModel.create({
                account_id: createdAccount.id,
                value1: req.body.value1,
                value2: req.body.value2
            })

            res.send({
                status: 200,
                success: true,
                message: "Data Stored"
            })
        } catch (error) {
            return res.send({
                status: 502,
                success: false,
                message: error
            })
        }
    },

    update: async (req, res) => {
        try {
            await AccountModel.update(req.body, {
                where: {
                    id: req.params.id
                }
            })
            await AccountModel.update(req.body, {
                where: {
                    account_id: req.params.id
                }
            })

            res.send({
                status: 200,
                success: true,
                message: "Data Updated"
            })
        } catch (error) {
            return res.send({
                status: 502,
                success: false,
                message: error
            })
        }
    },

    delete: async (req, res) => {
        try {
            const deletedData = AccountModel.update({
                DeletedAt: new Date().toUTCString()
            }, {
                where: {
                    id: req.params.id
                }
            })

            res.send({
                status: 200,
                success: true,
                message: "data Deleted",
                data: deletedData
            })
        } catch (error) {
            return res.send({
                status: 502,
                success: false,
                message: error
            })
        }
    }
}