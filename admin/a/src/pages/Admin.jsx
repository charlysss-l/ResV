import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Home from './Home/Home';
import SeatMap from './SeatMap/SeatMap';
import AddReservation from '../components/AddReservation/AddReservation';
import History from './History/History';
import HistoryTable from '../components/HistoryTable/HistoryTable';
import Login from './Login/Login';
import MaybeShowNavbar from '../components/MaybeShowNavbar/MaybeShowNavbar';
import SeatQR from './SeatQr/SeatQR';
import AddSeatForm from '../components/SeatForm/AddSeatForm';
import SeatTable from '../components/SeatTable/SeatTable';
import Footer from '../components/Footer/footer';
import DisplayCode from '../components/DisplayCode/DisplayCode';
import OngoingReservation from './OngoingReservation/OngoingReservation';
import OngoingReservationTable from '../components/OngoingReservationTable/OngoingReservationTable';
import AddEndReservation from '../components/AddEndReservation/AddEndReservation';

const apiUrl = import.meta.env.VITE_API_URL;

const Admin = () => {
  const location = useLocation(); // Get current route
  
  return (
    <main className="admin-page">
      <MaybeShowNavbar>
        <Navbar />
      </MaybeShowNavbar>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin/seat-map" element={<SeatMap />} />
        <Route path="/admin/add-reservation" element={<AddReservation />} />
        <Route path="/admin/history" element={<History />} />
        <Route path="/admin/history-table" element={<HistoryTable />} />
        <Route path="/admin/seat-qr" element={<SeatQR />} />
        <Route path="/admin/add-seat" element={<AddSeatForm />} />
        <Route path="/admin/seat-table" element={<SeatTable />} />
        <Route path="/admin/reservation-success" element={<DisplayCode />} />
        <Route path="/admin/ongoing" element={<OngoingReservation />} />
        <Route path="/admin/ongoing-reservation-table" element={<OngoingReservationTable />} />
        <Route path="/admin/add-end-reservation" element={<AddEndReservation />} />
      </Routes>
  
      {/* Conditionally render the Footer, excluding SeatMap */}
      {location.pathname !== '/admin/seat-map' && (
        <MaybeShowNavbar>
          <Footer />
        </MaybeShowNavbar>
      )}
    </main>
  );
};

export default Admin;
