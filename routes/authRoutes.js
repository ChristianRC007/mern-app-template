const { Router } = require('express')
const { httpCodes } = require('../helpers/codes')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const router = Router()

router.post(
  '/register',
  [
    check('email', 'Email not valid').isEmail(),
    check(
      'password',
      'Your password should have atleast 6 charachters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(httpCodes.BAD_REQUEST).json({
          errors: errors.array(),
          message: 'Invalid registration data',
        })
      }

      const { email, password } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .json({ message: 'Email is already registetred' })
      }
      const hashedPassword = await bcrypt.hash(password, 12)

      const user = new User({ email, password: hashedPassword })

      await user.save()

      res.status(httpCodes.CREATED).json({ message: 'User created' })
    } catch (error) {
      res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wron, try again.' })
    }
  },
)

router.post(
  '/login',
  [
    check('email', 'Enter a valid email').normalizeEmail().isEmail(),
    check('password', 'Enter a password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(httpCodes.BAD_REQUEST).json({
          errors: errors.array(),
          message: 'Invalid registration data',
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .json({ message: 'Wrong login or password' })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })

      res.json({ token, userId: user.id })
    } catch (error) {
      res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wron, try again.' })
    }
  },
)

module.exports = router
