import React, { useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from '@emailjs/browser';
import Header from './Header';

/**
 * Displays a contact form and sends messages through EmailJS.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Contact page.
 */
function Contact({ header }) {
  const [status, setStatus] = useState('idle');

  /**
   * Validates and submits the contact form.
   *
   * @param {React.SyntheticEvent<HTMLFormElement>} event - Submit event.
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (status === 'sending') return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const templateParams = {
      from_name: formData.get('from_name').trim(),
      reply_to: formData.get('reply_to').trim(),
      message: formData.get('message').trim(),
    };

    if (!templateParams.from_name || !templateParams.message) {
      setStatus('invalid');
      return;
    }

    setStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Header title={header} />

      <div className="section-content-container">
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          aria-busy={status === 'sending'}
        >
          <div className="mb-3">
            <label htmlFor="contact-name" className="form-label">
              Name
            </label>
            <input
              id="contact-name"
              name="from_name"
              type="text"
              className="form-control"
              autoComplete="name"
              maxLength={100}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-email" className="form-label">
              Email (optional)
            </label>
            <input
              id="contact-email"
              name="reply_to"
              type="email"
              className="form-control"
              autoComplete="email"
              maxLength={254}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-message" className="form-label">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="form-control"
              rows={6}
              maxLength={5000}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-pill btn-ghost"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>

          <p role="status" className="mt-3">
            {status === 'success'
              && 'Your message has been sent successfully.'}
            {status === 'error'
              && 'Unable to send your message. Please try again later.'}
            {status === 'invalid'
              && 'Please enter your name and message.'}
          </p>
        </form>
      </div>
    </>
  );
}

Contact.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Contact;
