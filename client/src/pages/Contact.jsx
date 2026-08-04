import { useState } from 'react';
import { submitContact } from '../api';
import { HERO_ABOUT, STORY_IMG } from '../utils/images';
import Newsletter from '../components/Newsletter';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await submitContact(formData);
      setMessage(response.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <header className="hero hero-page" style={{ backgroundImage: `url('${HERO_ABOUT}')` }}>
        <div className="container hero-inner">
          <h1>CONTACT US</h1>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <section className="section contact-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <span className="form-eyebrow">OUR LOCATION</span>
              <h2>WHERE TO FIND US</h2>
              <p className="contact-description">
                The Patio Time Cafe is located on 5th Street, in the heart of London. 
                Sip on the edge of SoHo, drawn down lines of petit connexions 
                on the terrace, imbibe carefully curated cocktails inside. 
                Cofi swirls céramique paintstrokes insides are permeate-roasty, 
                however still ultra luxe. Divine design feels urbane plus.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <span className="detail-icon">📍</span>
                  <span>5th St, Barbican, London EC2Y 8DS, UK</span>
                </div>
                <div className="contact-detail-item">
                  <span className="detail-icon">📞</span>
                  <span>+44(0)20 123 4567</span>
                </div>
                <div className="contact-detail-item">
                  <span className="detail-icon">✉️</span>
                  <span>booking@patiotime.com</span>
                </div>
              </div>

              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-solid"
                style={{ marginTop: '24px' }}
              >
                VIEW IN GOOGLE MAPS
              </a>
            </div>

            <div className="contact-image">
              <img src={STORY_IMG} alt="Cafe interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-form-section">
        <div className="container">
          <div className="contact-form-layout">
            {/* Left Side - Contact Info */}
            <div className="contact-form-info">
              <span className="form-eyebrow">GET IN TOUCH</span>
              <h2>CONTACT US</h2>
              <p className="contact-form-description">
                For general enquiries please email: <strong>info@patiotime.com</strong>
              </p>
              <p className="contact-form-description">
                Booking by email: <strong>booking@patiotime.com</strong>
              </p>
              <p className="contact-form-description">
                Tel: <strong>+39 055 123 4567</strong>
              </p>
              
              <div className="contact-hours" style={{ marginTop: '32px' }}>
                <strong>OPENING HOURS:</strong><br />
                Mon — Thu: 10:00 am - 01:00 am<br />
                Fri — Sun: 10:00 am - 02:00 am
              </div>

              <p className="form-eyebrow" style={{ marginTop: '40px', marginBottom: '12px' }}>
                ONLINE RESERVATION
              </p>
            </div>

            {/* Right Side - Contact Form */}
            <div className="contact-form-fields">
              <form className="contact-form-grid" onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <textarea
                    name="message"
                    placeholder="Your message (optional)"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="form-textarea"
                  />
                </div>

                {message && (
                  <div className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="form-submit" style={{ textAlign: 'left' }}>
                  <button type="submit" className="btn btn-solid" disabled={submitting}>
                    {submitting ? 'Sending...' : 'SUBMIT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
