import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import plane from '../../assets/plane.png';
import './DisplayCode.css';

const DisplayCode = () => {
    const location = useLocation();
    const { code } = location.state || { code: '' };
    const imageUrl = code;

    useEffect(() => {
        // Create confetti elements
        const container = document.querySelector('.display-container');
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `${Math.random() * 100}vh`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(confetti);
        }

        // Remove confetti elements after animation
        const timer = setTimeout(() => {
            document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="display-container">
            <img src={plane} alt="Plane" className="plane" />
            <h1 className="display-title">Reservation Successful!</h1>
            <div className="button-display-container">
                <p>
                    Please Scan Your Voucher Code: 
                    <br />
                    {code ? (
                        <img src={imageUrl} alt="Reservation Code" className="display-image" />
                    ) : (
                        'No Image Available'
                    )}
                </p>
            </div>
        </div>
    );
};

export default DisplayCode;
