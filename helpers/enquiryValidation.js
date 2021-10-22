const { body, validationResult } = require('express-validator')

exports.validationRules = () => {
  return [
    body(' client_email', 'Email is required').not().isEmpty(),
    body(' client_email').isEmail().withMessage('Enter proper email'),
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
