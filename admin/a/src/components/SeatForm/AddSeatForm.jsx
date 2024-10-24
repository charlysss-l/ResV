import { useState, useRef } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddSeatForm.css';
const apiUrl = import.meta.env.VITE_API_URL;

const storage = getStorage(); // Initialize Firebase Storage

function AddSeatForm({ onAddSeat, seat }) {
  const [addSeat, setAddSeat] = useState({
    seatNumber: seat ? seat.seatNumber : "",
    ThreeHourImage: seat ? seat.ThreeHourCode : "",
    WholeDayImage: seat ? seat.WholeDayCode : "",
    ThreeHourImageFile: null,
    WholeDayImageFile: null
  });

  const threeHourImageInputRef = useRef(null);
  const wholeDayImageInputRef = useRef(null);

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
    return "";
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToFirebase(file);
      if (type === 'ThreeHourImage') {
        setAddSeat(prev => ({ ...prev, ThreeHourImage: imageUrl, ThreeHourImageFile: file }));
      } else {
        setAddSeat(prev => ({ ...prev, WholeDayImage: imageUrl, WholeDayImageFile: file }));
      }
    }
  };

  const changeHandler = (e) => {
    setAddSeat({ ...addSeat, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = seat
        ? await axios.put(`${apiUrl}/admin/update-seat/${seat.seat_id}`, {
            seatNumber: addSeat.seatNumber,
            ThreeHourImage: addSeat.ThreeHourImage,
            WholeDayImage: addSeat.WholeDayImage
          })
        : await axios.post(`${apiUrl}/admin/add-seat`, {
            seatNumber: addSeat.seatNumber,
            ThreeHourImage: addSeat.ThreeHourImage,
            WholeDayImage: addSeat.WholeDayImage
          });

      alert(seat ? 'Seat updated' : 'Seat added');
      if (onAddSeat) onAddSeat(response.data.seat);

      setAddSeat({
        seatNumber: "",
        ThreeHourImage: "",
        WholeDayImage: "",
        ThreeHourImageFile: null,
        WholeDayImageFile: null
      });
      threeHourImageInputRef.current.value = null;
      wholeDayImageInputRef.current.value = null;
    } catch (err) {
      console.error('Error:', err);
      alert('Error adding/updating seat');
    }
  };

  return (
    <div className="div-con">
      <h2 className="add-reservation-title">{seat ? 'Edit Seat' : 'Add Seat'}</h2>
      <div className="add-reservation-form">
        <form>
          <label>
            Seat Number:
            <input type="text" name="seatNumber" onChange={changeHandler} value={addSeat.seatNumber} />
          </label>
          <label>
            Code for 3 Hours:
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'ThreeHourImage')}
              ref={threeHourImageInputRef}
            />
            {addSeat.ThreeHourImage && <img src={addSeat.ThreeHourImage} className='imageCode' alt="3 Hour Code" />}
          </label>
          <label>
            Code for 24 Hours:
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'WholeDayImage')}
              ref={wholeDayImageInputRef}
            />
            {addSeat.WholeDayImage && <img src={addSeat.WholeDayImage} className='imageCode' alt="24 Hour Code" />}
          </label>
          <div className="button">
            <button type="submit" className="submit-button-reservation" onClick={submitHandler}>
              {seat ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSeatForm;