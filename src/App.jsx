
import React, { useState, useEffect } from 'react';
import RegistrationCard from './components/RegistrationCard';

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [videoSrc, setVideoSrc] = useState('/fridayopen.mp4');
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registration-count`)
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
        setRegistrationOpen(false);
      } else {
        setVideoSrc('/fridayopen.mp4');
        setRegistrationOpen(true);
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
      <div
        style={{
          position: 'fixed',
          top: '70%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 2rem',
          borderRadius: '0.5rem',
          background: 'linear-gradient(135deg, #24445dff 0%, #0a0a0a 50%, #212121 100%)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
          width: '90vw',
          maxWidth: '500px',
          transition: 'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.35s',
          opacity: 1,
        }}
        className="registration-main-div popout"
      >
        <h1
          style={{
            color: 'white',
            fontSize: '2.2rem',
            textShadow: '2px 2px 8px #000',
            margin: 0,
            width: '100%',
            textAlign: 'center',
          }}
          className="responsive-heading"
        >
          <span className="heading-main">Participate & Win Cash Prizes!</span>
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '1rem',
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          className="responsive-lobby-row"
        >
          <h2
            style={{
              color: 'white',
              fontSize: '1.3rem',
              textShadow: '1px 1px 4px #000',
              margin: 0,
              textAlign: 'center',
            }}
            className="responsive-lobby-heading"
          >
            Only for @LPU Students
          </h2>
          {registrationCount >= 50 ? (
            <span
              style={{
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
              }}
            >
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
                background: registrationOpen
                  ? 'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)'
                  : 'linear-gradient(90deg, #444 0%, #222 100%)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                cursor: registrationOpen ? 'pointer' : 'not-allowed',
                transition: 'background 0.3s',
                opacity: registrationOpen ? 1 : 0.7,
                marginTop: 0,
              }}
              disabled={!registrationOpen}
              onMouseOver={e => {
                if (registrationOpen)
                  e.currentTarget.style.background =
                    'linear-gradient(90deg, #ff0000 0%, #ff4d4d 100%)';
              }}
              onMouseOut={e => {
                if (registrationOpen)
                  e.currentTarget.style.background =
                    'linear-gradient(90deg, #ff4d4d 0%, #ff0000 100%)';
              }}
              onClick={() => registrationOpen && setShowRegistration(true)}
              className="responsive-participate-btn"
            >
              {registrationOpen ? 'Participate Now' : 'Currently Closed!'}
            </button>
          )}
        </div>
        <style>{`
          .popout {
            transform: translate(-50%, -50%) scale(0.7);
            opacity: 0;
            animation: popout-appear 1.5s cubic-bezier(.68,-0.55,.27,1.55) forwards;
          }
          @keyframes popout-appear {
            0% {
              transform: translate(-50%, -50%) scale(0.7);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          @media (max-width: 600px) {
            .registration-main-div {
              max-width: 38vw !important;
              width: 38vw !important;
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;
            }
            .responsive-heading {
              font-size: 0.8rem !important;
            }
            .heading-main {
              display: inline-block;
            }
            .heading-main::after {
              content: 'Participate & Win Cash!';
              display: block;
              font-size: 0.7rem;
              font-weight: bold;
              color: white;
            }
            .heading-main {
              font-size: 0px !important;
            }
            .responsive-lobby-row {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 0.5rem;
            }
            .responsive-lobby-heading {
              font-size: 0.7rem !important;
              margin-bottom: 0.2rem !important;
            }
            .responsive-participate-btn {
              margin-left: 0 !important;
              margin-top: 0.2rem !important;
              width: 100%;
              font-size: 0.7rem !important;
              padding: 0.3rem 0.7rem !important;
            }
          }
        `}</style>
      </div>
      {showRegistration && (
        <RegistrationCard onClose={() => setShowRegistration(false)} />
      )}
    </>
  );
}

export default App;

