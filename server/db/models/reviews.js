const Sequelize = require('sequelize')
const db = require('../db')

const Review = db.define('review', {
  text: {
    type: Sequelize.TEXT,
    validate: {
      len: [20, 500]
    }
  }
})

module.exports = Review