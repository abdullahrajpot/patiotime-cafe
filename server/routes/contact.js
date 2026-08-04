const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new',
    });

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      contact 
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
