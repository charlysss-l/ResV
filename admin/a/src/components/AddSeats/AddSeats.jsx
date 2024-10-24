import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import axios from 'axios'; // Import axios for HTTP requests
import './AddSeats.css';
const apiUrl = import.meta.env.VITE_API_URL;

function AddSeats({ seat }) {
  const [status, setStatus] = useState(seat.status || 'available');
  const [isDragging, setIsDragging] = useState(false); // State to track dragging
  const [position, setPosition] = useState({ x: 0, y: 0 }); // State to track position
  const navigate = useNavigate();

  useEffect(() => {
    setStatus(seat.status);
  }, [seat]);

  useEffect(() => {
    console.log("Fetching position for seat_id:", seat.seat_id);
    const fetchPosition = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/seat-position/${seat.seat_id}`);
            const seatPosition = response.data.position;
            if (seatPosition) {
                setPosition(seatPosition);
            }
        } catch (error) {
            console.error('Error fetching seat position:', error);
        }
    };

    fetchPosition();
}, [seat.seat_id]);


  const handleMouseDown = () => {
    setIsDragging(true); // Set dragging state to true on mouse down
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Set dragging state to false on mouse up
  };

  const handleSeatClick = (e) => {
    if (status === 'available' && !isDragging) { // Check if not dragging
      navigate('/admin/add-reservation', { state: { seatNumber: seat.seatNumber } });
    }
  };

  const handleStop = async (e, data) => {
    // Update the position in state
    setPosition({ x: data.x, y: data.y });

    // Save the new position to MongoDB
    try {
      await axios.put(`${apiUrl}/admin/update-seat-position/${seat.seat_id}`, {
        x: data.x,
        y: data.y
      });
    } catch (error) {
      console.error('Error updating seat position:', error);
    }
  };

  return (
    <Draggable
      position={position} // Set the initial position
      onStart={handleMouseDown}  // Set dragging state to true on start
      onStop={(e, data) => {
        handleMouseUp();
        handleStop(e, data); // Save position when dragging stops
      }}
      cancel=".seat" // Prevents dragging if the target is the .seat element

    >
      <div className="main-container">
      <button
  className={`seat ${status}`}
  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
  onClick={handleSeatClick}
  onTouchStart={handleMouseDown}
  onTouchEnd={handleMouseUp}
  disabled={status !== 'available'}
>
  {seat.seatNumber}
</button>

      </div>
    </Draggable>
  );
}

export default AddSeats;