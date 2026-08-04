import { useState } from 'react';
import { createReservation } from '../api';
import { HERO_ABOUT } from '../utils/images';
import Newsletter from '../components/Newsletter';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await createReservation(formData);
      setMessage(response.message || 'Reservation submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        specialRequests: '',
      });
    } catch (err) {
      setMessage(err.message || 'Failed to submit reservation. Please try again.');
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
          <h1>RESERVATION</h1>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="form-section-header">
            <span className="form-eyebrow">ONLINE RESERVATION</span>
            <h2>Book A Table</h2>
            <p className="form-intro">
              Closed Sunday night, Mondays & Tuesdays. Due to the vast amount of bookings, 
              all bookings must now be secured with a credit card which will be charged $20/f 
              you do not show up for your booking.
            </p>
          </div>

          <form className="reservation-form" onSubmit={handleSubmit}>
            <div className="form-row-3">
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Person' : 'Persons'}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-row-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-row">
              <textarea
                name="specialRequests"
                placeholder="Special Requests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="5"
                className="form-textarea"
              />
            </div>

            {message && (
              <div className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-submit">
              <button type="submit" className="btn btn-solid" disabled={submitting}>
                {submitting ? 'Submitting...' : 'BOOK A TABLE NOW'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
