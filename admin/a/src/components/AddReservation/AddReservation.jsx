import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddReservation.css';
const apiUrl = import.meta.env.VITE_API_URL;

const AddReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve seat number from the location state
  const initialSeatNumber = location.state?.seatNumber || "";

  // Function to get today's date in MM-DD-YYYY format
  const getDefaultDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // Months are zero-based
    const day = today.getDate();
    const year = today.getFullYear();
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
  };

  // Function to get current time in 12-hour format with AM/PM
  const getDefaultTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes.toString().padStart(2, '0');
    return `${hours.toString().padStart(2, '0')}:${strMinutes} ${ampm}`;
  };

  const [addUsers, setAddUsers] = useState({
    name: "",
    email: "",
    contactNumber: "",
    company: "",
    seatNumber: initialSeatNumber,
    internetHours: "",
    startDate: getDefaultDate(),
    startTime: getDefaultTime(),
  });

  const [seats, setSeats] = useState([]);
  const [codeImage, setCodeImage] = useState("");

  useEffect(() => {
    axios.get(`${apiUrl}/admin/seat-qr`)
      .then(res => {
        setSeats(res.data);
      })
      .catch(err => console.error('Error fetching seats:', err));
  }, []);

  // Fetch and set the code image URL
  useEffect(() => {
    const selectedSeat = seats.find(seat => seat.seatNumber === addUsers.seatNumber);
    if (selectedSeat) {
      const code = addUsers.internetHours === '3' ? selectedSeat.ThreeHourCode : selectedSeat.WholeDayCode;
      setCodeImage(code || ""); // URL from Firebase Storage
    }
  }, [addUsers.seatNumber, addUsers.internetHours, seats]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setAddUsers(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const convertTo24HourFormat = (time) => {
    let [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const selectedSeat = seats.find(seat => seat.seatNumber === addUsers.seatNumber);
    const code = addUsers.internetHours === '3' ? selectedSeat?.ThreeHourCode : selectedSeat?.WholeDayCode;

    const startTime = new Date(`${addUsers.startDate} ${convertTo24HourFormat(addUsers.startTime)}`).toISOString();

    try {
      await axios.post(`${apiUrl}/admin/add-reservation`, {
        ...addUsers,
        code: code,
        startTime: startTime,
      });

      // Update the seat's status to 'active'
      await axios.put(`${apiUrl}/admin/update-seat-status`, {
        seatNumber: addUsers.seatNumber,
        status: 'active'
      });

      navigate('/admin/reservation-success', { state: { code } });

      // Reset form state
      setAddUsers({
        name: "",
        email: "",
        contactNumber: "",
        company: "",
        seatNumber: initialSeatNumber,
        internetHours: "",
        startDate: getDefaultDate(),
        startTime: getDefaultTime(),
      });
    } catch (err) {
      console.error('Error adding reservation:', err);
      alert('Error adding reservation. Please try again.');
    }
  };

  return (
    <div className="div-con">
      <h2 className="add-reservation-title">Add Your Information!</h2>
      <div className="add-reservation-form">
        <form>
          <div className="dateTime">
            <label>
              Date: {addUsers.startDate}
            </label>
            <label>
              Start Time: {addUsers.startTime}
            </label>
          </div>

          <label>
            Name:<span className='asterisk'>*</span>
            <input type="text" name="name" onChange={changeHandler} value={addUsers.name} />
          </label>
          <label>
            Email:<span className='asterisk'>*</span>
            <input type="email" name="email" onChange={changeHandler} value={addUsers.email} />
          </label>
          <label>
            Contact Number:<span className='asterisk'>*</span>
            <input type="text" name="contactNumber" onChange={changeHandler} value={addUsers.contactNumber} />
          </label>
          <label>
            Company:<span className='asterisk'>*</span>
            <input type="text" name="company" onChange={changeHandler} value={addUsers.company} />
          </label>
          <label>
            Seat Number:<span className='asterisk'>*</span>
            <input type="text" name="seatNumber" onChange={changeHandler} value={addUsers.seatNumber} readOnly disabled />
          </label>
          <label>
            Internet Hours:<span className='asterisk'>*</span>
            <select name="internetHours" onChange={changeHandler} value={addUsers.internetHours}>
              <option value="">Select Internet Hours</option>
              <option value="3">3 Hours</option>
              <option value="24">Whole Day</option>
            </select>
          </label>

          <div className="button">
            <button type="submit" className="submit-button-reservation" onClick={submitHandler}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReservation;
