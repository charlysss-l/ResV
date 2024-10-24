import { useEffect, useState } from 'react';
import AddSeats from '../../components/AddSeats/AddSeats';
import axios from 'axios';
import { imageDb } from '../../../../../backend/config';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import './SeatMap.css';
const apiUrl = import.meta.env.VITE_API_URL;

function SeatMap() {
    const [seats, setSeats] = useState([]);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleUpload = async () => {
        if (file !== null) {
            const imgRef = ref(imageDb, `files/${v4()}`);
            try {
                const uploadResult = await uploadBytes(imgRef, file);
                const url = await getDownloadURL(uploadResult.ref);
                setImageUrl(url);

                // After successfully uploading to Firebase, save the image URL to your backend
                await axios.post(`${apiUrl}/upload-image-url`, { imageUrl: url });
            } catch (error) {
                console.error("Error uploading image to Firebase:", error);
            }
        }
    };

    useEffect(() => {
        axios.get(`${apiUrl}/getImage`)
            .then(res => {
                const latestImage = res.data[0]; // Assuming the latest image is first
                setImageUrl(latestImage.image);
            })
            .catch(err => console.log(err));
    }, []);

    const getImageUrl = () => {
        return imageUrl ? imageUrl : '';
    };

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/seat-qr`);
                const data = await response.json();
                setSeats(data);
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };

        fetchSeats();
    }, []);

    return (
        <div className="main-container-reservation">
            <h2 className="seatMap-title">
                Seat Map
                <div className="fileUploadBtn">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="choose-photo"/>
                    <button className="uploadBtn" onClick={handleUpload}>Upload</button>
                </div>
            </h2>

            <div className="bothContainer">
                {seats.map(seat => (
                    <AddSeats key={seat.seatNumber} seat={seat} />
                ))}

                {imageUrl && <img className="floorMapImage" src={getImageUrl()} alt="Seat Map" />}
            </div>
        </div>


    );
}

export default SeatMap;