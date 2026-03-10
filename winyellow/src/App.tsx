import React, { useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    if (email && firstName && lastName) {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, firstName, lastName }),
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          setErrorMsg('An error occurred. Please try again.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setErrorMsg('Failed to connect to the server.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="capture-container">
        <h1>WinYellow</h1>
        <p>Subscribe for insider scoops & elections.</p>

        {submitted ? (
          <div className="success-message">
            Thanks for subscribing! We'll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="email-form">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {errorMsg && (
          <div style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}
      </div>

      <div className="disclaimer-footer">
        paid for by WinYellow. Not authorized by any candidate or candidate’s committee.
      </div>
    </div>
  );
}

export default App;
