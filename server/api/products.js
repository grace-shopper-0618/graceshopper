const router = require('express').Router()
const {Product} = require('../db/models')
module.exports = router

//get all products
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.findAll()
        res.json(products)
    } catch (err) {
        next(err)
    }
})

//get single product
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id,
    product = await Product.findById(id)

    if(!product) {
      const err = new Error(`No product found with id of ${id}.`)
      err.status = 404
      return next(err)
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
})