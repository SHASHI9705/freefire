
import React, { useState, useEffect } from 'react';
import RegistrationCard from './components/RegistrationCard';

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [videoSrc, setVideoSrc] = useState('/fridayopen.mp4');
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/registration-count')
      .then(res => res.json())
      .then(data => setRegistrationCount(data.count))
      .catch(() => setRegistrationCount(0));
  }, [showRegistration]);

  useEffect(() => {
    const updateVideoAndRegistration = () => {
      const now = new Date();
      const day = now.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
      const hour = now.getHours();
      if (
        (day === 5 && hour >= 18) || // Friday after 6pm
        (day === 6 && hour < 18)     // Saturday before 6pm
      ) {
        setVideoSrc('/open.mp4');
        setRegistrationOpen(true);
      } else {
        setVideoSrc('/fridayopen.mp4');
        setRegistrationOpen(false);
      }
    };
    updateVideoAndRegistration();
    const interval = setInterval(updateVideoAndRegistration, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: -1 }}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'fill',
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
      <div style={{
        position: 'fixed',
        top: '70%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2rem',
        borderRadius: '0.5rem',
        background: 'linear-gradient(135deg, #24445dff 0%, #0a0a0a 50%, #212121 100%)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{ color: 'white', fontSize: '2.8rem', textShadow: '2px 2px 8px #000', margin: 0 }}>Participate & Win Cash Prizes!</h1>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.3rem', textShadow: '1px 1px 4px #000', margin: 0 }}>Free Fire Lobby</h2>
          {registrationCount >= 50 ? (
            <span style={{
              marginLeft: '1.5rem',
              padding: '0.6rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#fff',
              background: 'linear-gradient(90deg, #444 0%, #222 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              Lobby is full
            </span>
          ) : (
            <button
              style={{
                marginLeft: '1.5rem',
                padding: '0.6rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#fff',
                background: registrationOpen ? 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)' : 'linear-gradient(90deg, #444 0%, #222 100%)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                cursor: registrationOpen ? 'pointer' : 'not-allowed',
                transition: 'background 0.3s',
                opacity: registrationOpen ? 1 : 0.7,
              }}
              disabled={!registrationOpen}
              onMouseOver={e => {
                if (registrationOpen) e.currentTarget.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4d4d 100%)';
              }}
              onMouseOut={e => {
                if (registrationOpen) e.currentTarget.style.background = 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)';
              }}
              onClick={() => registrationOpen && setShowRegistration(true)}
            >
              {registrationOpen ? 'Participate Now' : 'Currently Closed!'}
            </button>
          )}
        </div>
      </div>
      {showRegistration && (
        <RegistrationCard onClose={() => setShowRegistration(false)} />
      )}
    </>
  );
}

export default App;
