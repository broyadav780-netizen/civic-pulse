import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import crypto from 'node:crypto'
import express from 'express'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.PORT || 3001)
const OTP_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_OTP_ATTEMPTS = 5
const users = new Map()
const pendingOtps = new Map()

app.use(cors())
app.use(express.json())

const cleanEmail = value => String(value || '').trim().toLowerCase()
const otpHash = (email, otp) => crypto.createHash('sha256').update(`${email}:${otp}`).digest('hex')
const generateOtp = () => crypto.randomInt(100000, 1000000).toString()
const publicUser = user => ({ id: user.id, name: user.name, email: user.email, verified: user.verified })

function mailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

async function issueOtp(email) {
  const transport = mailer()
  if (!transport) throw new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.')
  const otp = generateOtp()
  const now = Date.now()
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your CivicPulse verification code',
    text: `Your CivicPulse verification code is ${otp}. It expires in 10 minutes. If you did not create an account, you can ignore this email.`,
  })
  pendingOtps.set(email, { hash: otpHash(email, otp), expiresAt: now + OTP_TTL_MS, resendAt: now + RESEND_COOLDOWN_MS, attempts: 0 })
  return { expiresAt: now + OTP_TTL_MS, resendAt: now + RESEND_COOLDOWN_MS }
}

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = cleanEmail(req.body.email)
  const password = String(req.body.password || '')
  if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  const existing = users.get(email)
  if (existing?.verified) return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' })
  const previousOtp = pendingOtps.get(email)
  if (previousOtp && previousOtp.resendAt > Date.now()) return res.status(429).json({ message: 'Please wait before requesting another verification code.', retryAt: previousOtp.resendAt })
  const user = { id: existing?.id || `CIT-${crypto.randomUUID()}`, name, email, passwordHash: await bcrypt.hash(password, 12), verified: false }
  users.set(email, user)
  try {
    const { expiresAt, resendAt } = await issueOtp(email)
    return res.status(201).json({ message: 'Verification code sent.', email, expiresAt, resendAt })
  } catch (error) {
    return res.status(503).json({ message: error.message || 'Unable to send the verification email. Please try again.' })
  }
})

app.post('/api/auth/verify-email', (req, res) => {
  const email = cleanEmail(req.body.email)
  const otp = String(req.body.otp || '').trim()
  const record = pendingOtps.get(email)
  if (!record || record.expiresAt <= Date.now()) {
    pendingOtps.delete(email)
    return res.status(400).json({ message: 'This verification code has expired. Request a new code.' })
  }
  if (!/^\d{6}$/.test(otp) || !crypto.timingSafeEqual(Buffer.from(record.hash), Buffer.from(otpHash(email, otp)))) {
    record.attempts += 1
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      pendingOtps.delete(email)
      return res.status(400).json({ message: 'Too many incorrect codes. Request a new code.' })
    }
    return res.status(400).json({ message: 'That verification code is incorrect.' })
  }
  const user = users.get(email)
  if (!user) return res.status(400).json({ message: 'Registration could not be found. Please create an account again.' })
  user.verified = true
  pendingOtps.delete(email)
  return res.json({ message: 'Email verified successfully.', citizen: publicUser(user) })
})

app.post('/api/auth/resend-otp', async (req, res) => {
  const email = cleanEmail(req.body.email)
  const user = users.get(email)
  if (!user || user.verified) return res.status(400).json({ message: 'No unverified account was found for this email.' })
  const record = pendingOtps.get(email)
  if (record && record.resendAt > Date.now()) return res.status(429).json({ message: 'Please wait before requesting another verification code.', retryAt: record.resendAt })
  try {
    const { expiresAt, resendAt } = await issueOtp(email)
    return res.json({ message: 'A new verification code was sent.', expiresAt, resendAt })
  } catch (error) {
    return res.status(503).json({ message: error.message || 'Unable to send the verification email. Please try again.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const email = cleanEmail(req.body.email)
  const user = users.get(email)
  if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' })
  if (!user.verified) return res.status(403).json({ message: 'Verify your email before signing in.', requiresVerification: true, email })
  return res.json({ citizen: publicUser(user) })
})

app.listen(port, () => console.log(`CivicPulse auth API listening on http://localhost:${port}`))
