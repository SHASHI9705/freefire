import React, { useState } from 'react';

const RegistrationCard = ({ onClose }) => {
  const [form, setForm] = useState({
    playerName: '',
    email: '',
    freeFireUID: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!, Details will be shared soon.');
        setForm({ playerName: '', email: '', freeFireUID: '', phoneNumber: '' });
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch {
      setMessage('Server error.');
    }
    setLoading(false);
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
        <h2 style={{ marginBottom: '1rem' }}>Registration</h2>
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
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>
    </div>
  );
};

export default RegistrationCard;
