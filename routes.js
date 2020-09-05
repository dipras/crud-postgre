const router = require('express').Router()
const controllers = require('./controllers')

router.get('/get', controllers.getAll)
router.get('/excel', controllers.excel)
router.get('/get/:id', controllers.show)
router.post('/store', controllers.store)
router.post('/update/:id', controllers.update)
router.get('/delete/:id', controllers.delete)

module.exports = router