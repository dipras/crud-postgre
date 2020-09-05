const AccountModel = require('./models/Account.model')
const ValueModel = require('./models/Value.model')

const data = [{
        code: "gh46tgw",
        name: "Agung",
        value1: 6000,
        value2: 3000
    },
    {
        code: "69fgerlka",
        name: "Aldy",
        value1: 4500,
        value2: 2000
    },
    {
        code: "tgjlkawejt",
        name: "Dipras",
        value1: 3000,
        value2: 7000
    },
    {
        code: "gakletg",
        name: 'Alvin',
        value1: 6000,
        value2: 1000
    },
    {
        code: "jtglketg",
        name: "Angga",
        value1: 8000,
        value2: 4000
    },
    {
        code: 'gjeklwajtlk',
        name: "Dewa",
        value1: 2000,
        value2: 4000
    },
    {
        code: "nglaewntg",
        name: "Adit",
        value1: 2500,
        value2: 6500
    },
    {
        code: "jltgkeaw",
        name: "Jarwo",
        value1: 9000,
        value2: 4000
    },
    {
        code: "gjelwkjtg",
        name: "Reza",
        value1: 5000,
        value2: 7000
    },
    {
        code: "jglkajet",
        name: "Tejo",
        value1: 4000,
        value2: 8000
    },
    {
        code: "gageeatg",
        name: "Bejo",
        value1: 4000,
        value2: 10000
    },
    {
        code: "tgujewgfg",
        name: "Fahri",
        value1: 5000,
        value2: 2000
    },
    {
        code: 'jgkgewa',
        name: "Dania",
        value1: 2000,
        value2: 3000
    },
    {
        code: "geawjg",
        name: "Naufal",
        value1: 7000,
        value2: 3000
    },
    {
        code: 'gjalkewjl',
        name: "Zilvia",
        value1: 6000,
        value2: 8000
    },
    {
        code: "ghewjak",
        name: "Mutia",
        value1: 3000,
        value2: 1000
    },
    {
        code: "3tjlkw",
        name: "Sigit",
        value1: 7000,
        value2: 9000
    },
    {
        code: "gharew",
        name: "Evi",
        value1: 3000,
        value2: 8000
    },
    {
        code: "gesaklrg",
        name: "Ridho",
        value1: 3000,
        value2: 0
    },
    {
        code: "gjew",
        name: "Anas",
        value1: 5000,
        value2: 7000
    },
    {
        code: "gjklawe",
        name: "Mahmud",
        value1: 4000,
        value2: 8000
    }
]

Promise.all([AccountModel.sync({
    force: true
}), ValueModel.sync({
    force: true
})]).then(() => {
    data.forEach(async val => {
        const account = await AccountModel.create({
            code: val.code,
            name: val.name
        })
        await ValueModel.create({
            account_id: account.id,
            value1: val.value1,
            value2: val.value2
        })
    })
})