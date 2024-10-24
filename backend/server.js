const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const UserModel = require('./Users');
const {v4: uuidv4 }= require('uuid')
const ImageIdModel = require('./imageID');
require('dotenv').config();

const { addUser, fetchUser, removeUser, updateEndReservation } = require('./user');
const { addSeat, fetchSeats, removeSeat, Seat } = require('./seat');
const { updateSeatStatus } = require('./seat')
const loginAdm = require('./src/routes/login');

const app = express();

app.use(cors({
    origin: 'https://res-v.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const port = process.env.PORT || 3000; 


app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true
})

    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Express app is running');
});



//this is for the seatmap upload image using firebase
app.post('/upload-image-url', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        // Fetch the existing image
        const existingImage = await UserModel.findOne().sort({ image_id: -1 });

        // Delete the old image if it exists (optional for Firebase)
        if (existingImage) {
            await UserModel.deleteOne({ _id: existingImage._id });
        }

        // Get or initialize the current image_id
        let imageIdDoc = await ImageIdModel.findOne();
        if (!imageIdDoc) {
            imageIdDoc = new ImageIdModel({ currentId: 0 });
            await imageIdDoc.save();
        }

        // Increment the image_id and save
        const imageId = imageIdDoc.currentId;
        imageIdDoc.currentId += 1;
        await imageIdDoc.save();

        // Create the new image record with the Firebase URL
        const newImage = new UserModel({ image_id: imageId, image: imageUrl });
        await newImage.save();

        // Send back the image information
        res.json({ success: true, image: newImage.image });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

app.get('/getImage', (req, res) => {
    UserModel.find().sort({ image_id: -1 }).limit(1) // Sort by image_id in descending order
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

//this is for the seat qr code image
app.post('/upload-seat-image',  async (req, res) => {
    try {
        // Save the image file name and URL
        const imageUrl = req.file.filename;

        res.json({ success: true, imageUrl });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/admin/update-seat-position/:seat_id', async (req, res) => {
    try {
        const { seat_id } = req.params;
        const { x, y } = req.body;

        const updatedSeat = await Seat.findOneAndUpdate(
            { seat_id },
            { 'position.x': x, 'position.y': y },
            { new: true }
        );

        if (updatedSeat) {
            res.json({ success: true, seat: updatedSeat });
        } else {
            res.status(404).json({ success: false, message: 'Seat not found' });
        }
    } catch (error) {
        console.error('Error updating seat position:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.get('/admin/seat-position/:seat_id', async (req, res) => {
    try {
        const seat = await Seat.findOne({ seat_id: req.params.seat_id });
        if (seat) {
            console.log(`Seat found: ${JSON.stringify(seat)}`);
            res.json({ position: seat.position });
        } else {
            console.log(`Seat with ID ${req.params.seat_id} not found.`);
            res.status(404).json({ message: 'Seat not found' });
        }
    } catch (error) {
        console.error('Error fetching seat position:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.put('/admin/update-seat/:seat_id', async (req, res) => {
    try {
        const { seat_id } = req.params;
        const { seatNumber, ThreeHourImage, WholeDayImage } = req.body;

        // Validate input
        if (!seat_id || !seatNumber) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const updatedSeat = await Seat.findOneAndUpdate(
            { seat_id },
            { seatNumber, ThreeHourCode: ThreeHourImage, WholeDayCode: WholeDayImage },
            { new: true } // Return the updated document
        );

        if (updatedSeat) {
            res.json({ success: true, seat: updatedSeat });
        } else {
            res.status(404).json({ success: false, message: 'Seat not found' });
        }
    } catch (error) {
        console.error('Error updating seat:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.use('/auth', loginAdm);

app.post('/admin/add-reservation', addUser);
app.get('/admin/history-table', fetchUser);
app.post('/admin/remove-user', removeUser);
app.post('/admin/end-reservation', updateEndReservation);

app.post('/admin/add-seat', addSeat);
app.get('/admin/seat-qr', fetchSeats);
app.post('/admin/remove-seat', removeSeat);
app.put('/admin/update-seat-status', updateSeatStatus);

const admin = require('./src/scripts/admin');
admin();

app.listen(port, err => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        console.log(`Server running on port ${port}`);
    }
});
