const { body, validationResult } = require('express-validator')

exports.validationRules = () => {
  return [
    body('item_description', 'Item description is required').not().isEmpty(),
    body('model', 'Item model is required').not().isEmpty(),
    body('brand', 'Item brand is required').not().isEmpty(),
    body('quantity', 'Item quantity is required').not().isEmpty(),
  ]
}

exports.validation = () => {
  return (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors })
    }
    next()
  }
}
