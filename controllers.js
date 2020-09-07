const Excel = require('exceljs')

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

        let data = []

        result.forEach((v, key) => {
            if (key % 10 == 0 || key == 0) {
                data = [...data, {
                    name: (key + 10) / 10,
                    details: result.slice(key, (key + 10))
                }]
            }
        })
        res.send({
            code: 200,
            success: true,
            message: "Get Accounts",
            data: data
        })
    },

    excel: async (req, res) => {
        const result = await getData(true)
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
            if ((index + 1) % 10 == 0) {
                const data = result.slice((index - 9), (index + 1))
                const value1 = data.map(m => m.value1).reduce((total, num) => total + num)
                const value2 = data.map(m => m.value2).reduce((total, num) => total + num)
                const avg = data.map(m => m.avg).reduce((total, num) => total + num)

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
        try {
            const createdData = AccountModel.create({
                code: req.body.code,
                name: req.body.name
            })

            res.send({
                status: 200,
                success: true,
                message: "Data Stored",
                data: createdData
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
            const updatedData = AccountModel.update(req.body, {
                where: {
                    id: req.params.id
                }
            })

            res.send({
                status: 200,
                success: true,
                message: "Data Updated",
                data: updatedData
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