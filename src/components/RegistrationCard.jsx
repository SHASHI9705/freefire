import React, { useState } from 'react';

const RegistrationCard = ({ onClose }) => {
  // Change this value to update the entry fee
  const entryFee = 25;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  const [form, setForm] = useState({
    playerName: '',
    email: '',
    freeFireUID: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Load Razorpay script if not loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => openRazorpay();
      script.onerror = () => {
        setMessage('Failed to load payment gateway.');
        setLoading(false);
      };
    } else {
      openRazorpay();
    }
  };

  const openRazorpay = () => {
    const options = {
      key: razorpayKey,
      amount: entryFee * 100, // in paise
      currency: 'INR',
      name: 'Free Fire Registration',
      description: 'Entry Fee',
      handler: async function (response) {
        // Payment successful, now submit registration
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          const data = await res.json();
          if (res.ok) {
            setForm({ playerName: '', email: '', freeFireUID: '', phoneNumber: '' });
            setShowSuccessPopup(true);
          } else {
            setMessage(data.error || 'Registration failed.');
          }
        } catch {
          setMessage('Server error.');
        }
        setLoading(false);
      },
      prefill: {
        name: form.playerName,
        email: form.email,
        contact: form.phoneNumber,
      },
      theme: {
        color: '#ff4d4d',
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #24445dff 0%, #0a0a0a 50%, #212121 100%)',
        padding: '2rem 1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
        width: '360px',
        minHeight: '480px',
        color: 'white',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Registration Entry Fee
          <span style={{ fontWeight: 'bold', color: '#ffd700', fontSize: '1.3rem', marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
            ₹{entryFee}
          </span>
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="playerName"
            placeholder="Player Name"
            required
            value={form.playerName}
            onChange={handleChange}
            style={{ width: '100%', display: 'block', marginBottom: '1.5rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.4rem', border: 'none', boxSizing: 'border-box' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            style={{ width: '100%', display: 'block', marginBottom: '1.5rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.4rem', border: 'none', boxSizing: 'border-box' }}
          />
          <input
            type="text"
            name="freeFireUID"
            placeholder="Free Fire UID"
            required
            value={form.freeFireUID}
            onChange={handleChange}
            style={{ width: '100%', display: 'block', marginBottom: '1.5rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.4rem', border: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '0.4rem' }}>
              <span style={{
                color: '#000000ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '0.2rem 0.7rem',
                background: 'white',
                borderTopLeftRadius: '0.4rem',
                borderBottomLeftRadius: '0.4rem',
                borderRight: '1px solid #eee',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>+91</span>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                value={form.phoneNumber}
                onChange={e => {
                  // Only allow numbers and max 10 digits
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setForm({ ...form, phoneNumber: val });
                }}
                pattern="[0-9]{10}"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: '0.4rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: 'transparent',
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.2rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.4rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              transition: 'background 0.3s, transform 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4d4d 100%)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Processing...' : 'Pay & Register'}
          </button>
        </form>
        {message && <div style={{ marginTop: '1rem', color: '#ff4d4d', textAlign: 'center' }}>{message}</div>}
        {showSuccessPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}>
            <div style={{
              background: 'white',
              color: '#222',
              borderRadius: '1rem',
              boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
              padding: '2.5rem 2rem',
              minWidth: '320px',
              maxWidth: '90vw',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Congratulations!</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#444' }}>
                Your registration has been successfully completed.<br />
                The details will be shared with you shortly via email.<br />
                Stay tuned and keep an eye on your inbox!
              </p>
              <button
                style={{
                  padding: '0.8rem 2.2rem',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.4rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  marginTop: '1rem',
                }}
                onClick={() => {
                  setShowSuccessPopup(false);
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>
    </div>
  );
};

export default RegistrationCard;
