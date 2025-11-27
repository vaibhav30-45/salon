
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inspiration_saloon'
const adminUser = process.env.ADMIN_USER || 'admin'
const adminPass = process.env.ADMIN_PASS || 'password123'
const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me'
const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS

// Middlewares
app.use(cors())
app.use(express.json())

// Customer schema for loyalty system
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 0 },
  email: { type: String },
}, { timestamps: true })
const Customer = mongoose.model('Customer', customerSchema)

// Helper: get customer type and discount
function getCustomerTypeAndDiscount(visitCount) {
  if (visitCount >= 100) return { type: 'Premium', discount: 20 }
  if (visitCount >= 50) return { type: 'Advanced', discount: 10 }
  if (visitCount >= 20) return { type: 'Local', discount: 5 }
  return { type: 'Normal', discount: 0 }
}

// Admin: get all customers with loyalty info
app.get('/api/admin/customers', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query
    let query = {}
    if (type && ['Normal','Local','Advanced','Premium'].includes(type)) {
      // Filter by type using visitCount
      if (type === 'Normal') query.visitCount = { $lt: 20 }
      if (type === 'Local') query.visitCount = { $gte: 20, $lt: 50 }
      if (type === 'Advanced') query.visitCount = { $gte: 50, $lt: 100 }
      if (type === 'Premium') query.visitCount = { $gte: 100 }
    }
    const customers = await Customer.find(query).sort({ visitCount: -1 })
    const result = customers.map(c => {
      const { type, discount } = getCustomerTypeAndDiscount(c.visitCount)
      return {
        id: c._id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        visitCount: c.visitCount,
        type,
        discount
      }
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



// Mongo connection
mongoose.set('strictQuery', true)
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err))

// Schema & Model
const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    gender: { type: String, enum: ['male', 'female'], required: true }, 
    service: { type: String, required: true },
    preferredDate: { type: String, required: true },
     finalSlot: { type: String }, 
    notes: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Appointment = mongoose.model('Appointment', appointmentSchema)

// Services
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    duration: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' }

  },
  { timestamps: true }
)
const Service = mongoose.model('Service', serviceSchema)

// Messages (from contact form)
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'read'], default: 'pending' },
  },
  { timestamps: true }
)
const Message = mongoose.model('Message', messageSchema)

// Gallery images (for public gallery)
const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)
const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema)

// Makeover suggestions (AI recommendations)
const makeoverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)
const Makeover = mongoose.model('Makeover', makeoverSchema)

// Receipt system
const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientEmail: { type: String },
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'online'], default: 'cash' },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'refunded'], default: 'paid' },
    notes: { type: String },
    generatedBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
)
const Receipt = mongoose.model('Receipt', receiptSchema)

// Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/appointments', async (req, res) => {
  try {
    const {
      name,
      phone,
      service,
      preferredDate,
      finalSlot,
       gender,
    } = req.body || {}
    const errors = []
    if (!name) errors.push('Name is required')
    if (!phone) errors.push('Phone is required')
      if (!gender) errors.push('Gender is required')
    if (!service) errors.push('Service is required')
    if (!preferredDate) errors.push('Preferred date is required')
    if (!finalSlot) errors.push('Preferred time is required')
    if (errors.length) return res.status(422).json({ errors })

    // reject if the selected slot is already booked (any non-cancelled status)
    const existing = await Appointment.findOne({ preferredDate, finalSlot, status: { $ne: 'cancelled' } })
    if (existing) return res.status(409).json({ error: 'Selected time slot is already booked' })

    // Loyalty: Find or create customer, increment visit count
    let customer = await Customer.findOne({ phone })
    if (!customer) {
      customer = await Customer.create({ name, phone, email: req.body.email || '', visitCount: 1 })
    } else {
      customer.name = name // update name in case it changed
      customer.email = req.body.email || customer.email
      customer.visitCount += 1
      await customer.save()
    }

    const appt = await Appointment.create(req.body)
    res.status(201).json(appt)
  } catch (err) {
    console.error('Create appointment error:', err)
    res.status(400).json({ error: err.message })
  }
})

// Return booked time slots for a given date
app.get('/api/appointments/booked', async (req, res) => {
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' })
  const list = await Appointment.find({ preferredDate: date, status: { $ne: 'cancelled' } }).select('preferredTime -_id')
  res.json(list.map(x => x.preferredTime))
})

// Public contact message endpoint
app.post('/api/messages', async (req, res) => {
  try {
    const { name, message } = req.body || {}
    if (!name || !message) return res.status(422).json({ error: 'Name and message are required' })
    const saved = await Message.create(req.body)
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Public: list active services for the main website
app.get('/api/services', async (req, res) => {
  try {
    const items = await Service.find({ active: true }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Public endpoints for gallery and makeovers
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await GalleryImage.find({ active: true }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/makeovers', async (req, res) => {
  try {
    const items = await Makeover.find({ active: true }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin auth helpers
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ role: 'admin', username }, jwtSecret, { expiresIn: '8h' })
    return res.json({ token })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

app.get('/api/admin/appointments', authMiddleware, async (req, res) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/admin/appointments/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/admin/appointments/:id', authMiddleware, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Optional: email client about appointment
app.post('/api/admin/appointments/:id/notify', authMiddleware, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })
    if (!appt.email) return res.status(400).json({ error: 'Client email not available' })

    const { subject, message } = req.body || {}
    if (!subject || !message) return res.status(422).json({ error: 'subject and message are required' })

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log('SMTP not configured; message would be sent:', { to: appt.email, subject, message })
      return res.json({ ok: true, simulated: true })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort ? Number(smtpPort) : 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    })
    await transporter.sendMail({ from: smtpUser, to: appt.email, subject, text: message })
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Services admin CRUD
app.get('/api/admin/services', authMiddleware, async (req, res) => {
  const items = await Service.find().sort({ createdAt: -1 })
  res.json(items)
})

app.post('/api/admin/services', authMiddleware, async (req, res) => {
  try {
    const s = await Service.create(req.body)
    res.status(201).json(s)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/admin/services/:id', authMiddleware, async (req, res) => {
  try {
    const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(s)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/admin/services/:id', authMiddleware, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Messages admin
app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  const items = await Message.find().sort({ createdAt: -1 })
  res.json(items)
})

// Gallery admin CRUD
app.get('/api/admin/gallery', authMiddleware, async (req, res) => {
  const items = await GalleryImage.find().sort({ createdAt: -1 })
  res.json(items)
})

app.post('/api/admin/gallery', authMiddleware, async (req, res) => {
  try {
    const g = await GalleryImage.create(req.body)
    res.status(201).json(g)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/admin/gallery/:id', authMiddleware, async (req, res) => {
  try {
    const g = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(g)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/admin/gallery/:id', authMiddleware, async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Makeovers admin CRUD
app.get('/api/admin/makeovers', authMiddleware, async (req, res) => {
  const items = await Makeover.find().sort({ createdAt: -1 })
  res.json(items)
})

app.post('/api/admin/makeovers', authMiddleware, async (req, res) => {
  try {
    const m = await Makeover.create(req.body)
    res.status(201).json(m)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/admin/makeovers/:id', authMiddleware, async (req, res) => {
  try {
    const m = await Makeover.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(m)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/admin/makeovers/:id', authMiddleware, async (req, res) => {
  try {
    await Makeover.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/admin/messages/:id', authMiddleware, async (req, res) => {
  try {
    const m = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(m)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Receipt system admin endpoints
app.get('/api/admin/receipts', authMiddleware, async (req, res) => {
  try {
    const { search, status, paymentMethod, startDate, endDate } = req.query
    let query = {}
    
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (status) query.paymentStatus = status
    if (paymentMethod) query.paymentMethod = paymentMethod
    
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }
    
    const receipts = await Receipt.find(query)
      .populate('appointmentId', 'name phone email service preferredDate preferredTime status')
      .sort({ createdAt: -1 })
    
    res.json(receipts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/receipts', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, paymentMethod, notes } = req.body
    
    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    
    // Generate unique receipt number
    const receiptCount = await Receipt.countDocuments()
    const receiptNumber = `RCP-${String(receiptCount + 1).padStart(6, '0')}`
    
    // Get service price (assuming it's stored in appointment or we need to fetch from services)
    const service = await Service.findOne({ name: appointment.service })
    const servicePrice = service ? service.price : 0
    
    const receiptData = {
      receiptNumber,
      appointmentId,
      clientName: appointment.name,
      clientPhone: appointment.phone,
      clientEmail: appointment.email,
      serviceName: appointment.service,
      servicePrice,
      appointmentDate: appointment.preferredDate,
      appointmentTime: appointment.preferredTime,
      paymentMethod: paymentMethod || 'cash',
      notes,
      generatedBy: req.user.username || 'admin'
    }
    
    const receipt = await Receipt.create(receiptData)
    
    // Mark appointment as paid
    await Appointment.findByIdAndUpdate(appointmentId, { paid: true })
    
    res.status(201).json(receipt)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/api/admin/receipts/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('appointmentId', 'name phone email service preferredDate preferredTime status')
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' })
    }
    
    res.json(receipt)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/admin/receipts/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('appointmentId', 'name phone email service preferredDate preferredTime status')
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' })
    }
    
    res.json(receipt)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/admin/receipts/:id', authMiddleware, async (req, res) => {
  try {
    await Receipt.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Generate receipt for appointment
app.post('/api/admin/appointments/:id/receipt', authMiddleware, async (req, res) => {
  try {
    const { paymentMethod, notes } = req.body
    const appointmentId = req.params.id
    
    // Check if receipt already exists
    const existingReceipt = await Receipt.findOne({ appointmentId })
    if (existingReceipt) {
      return res.status(409).json({ error: 'Receipt already exists for this appointment' })
    }
    
    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    
    // Generate unique receipt number
    const receiptCount = await Receipt.countDocuments()
    const receiptNumber = `RCP-${String(receiptCount + 1).padStart(6, '0')}`
    
    // Get service price
    const service = await Service.findOne({ name: appointment.service })
    const servicePrice = service ? service.price : 0
    
    const receiptData = {
      receiptNumber,
      appointmentId,
      clientName: appointment.name,
      clientPhone: appointment.phone,
      clientEmail: appointment.email,
      serviceName: appointment.service,
      servicePrice,
      appointmentDate: appointment.preferredDate,
      appointmentTime: appointment.preferredTime,
      paymentMethod: paymentMethod || 'cash',
      notes,
      generatedBy: req.user.username || 'admin'
    }
    
    const receipt = await Receipt.create(receiptData)
    
    // Mark appointment as paid
    await Appointment.findByIdAndUpdate(appointmentId, { paid: true })
    
    res.status(201).json(receipt)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})


