import './SeatTable.css';
import { useState, useEffect } from 'react';
import AddSeatForm from '../SeatForm/AddSeatForm';
import Modal from '../Modal/Modal';
const apiUrl = import.meta.env.VITE_API_URL;


const removeSeat = async (seat_id, onSeatRemoved) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this seat?');

    if (isConfirmed) {
        try {
            const response = await fetch(`${apiUrl}/admin/remove-seat`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ seat_id }),
            });

            if (response.ok) {
                alert('Seat is removed');
                if (onSeatRemoved) onSeatRemoved(seat_id);
            } else {
                const errorData = await response.json();
                alert(`Failed to remove the seat: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to remove the seat');
        }
    }
};

const SeatTable = ({ seat = [] }) => {
    const [seats, setSeats] = useState(seat);
    const [currentPage, setCurrentPage] = useState(1);
    const seatsPerPage = 8;
    const [editingSeat, setEditingSeat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        setSeats(seat);
    }, [seat]);

    const handleSeatRemoved = (seat_id) => {
        setSeats(prevSeats => prevSeats.filter(seat => seat.seat_id !== seat_id));
    };

    const handleClickPageNumber = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditClick = (seat) => {
        setEditingSeat(seat);
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setEditingSeat(null);
        setIsModalOpen(false); // Close the modal
    };

    const totalPages = Math.ceil(seats.length / seatsPerPage);
    const indexOfLastSeat = currentPage * seatsPerPage;
    const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
    const currentSeats = seats.slice(indexOfFirstSeat, indexOfLastSeat);

    return (
        <div className="conn">
            <h2 className="table-title">Seat Details</h2>
            <div className="history-container3">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th className="title">Seat Number</th>
                            <th className="title">3hr Internet Code</th>
                            <th className="title">24hr Internet Code</th>
                            <th className="title">Edit</th>
                            <th className="title">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSeats.length > 0 ? (
                            currentSeats.map((seat, index) => (
                                <tr key={index}>
                                    <td className="data">{seat.seatNumber}</td>
                                    <td className="data">
    {seat.ThreeHourCode ? (
        <img src={seat.ThreeHourCode} alt="3 Hour Code" className="seat-image" />
    ) : 'No Image'}
</td>
<td className="data">
    {seat.WholeDayCode ? (
        <img src={seat.WholeDayCode} alt="24 Hour Code" className="seat-image" />
    ) : 'No Image'}
</td>


                                    <td className="data">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(seat)}
                                            className="edit"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="data">
                                        <button
                                            type="button"
                                            onClick={() => removeSeat(seat.seat_id, handleSeatRemoved)}
                                            className="delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="data">No seats available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handleClickPageNumber(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <AddSeatForm
                    onAddSeat={(updatedSeat) => {
                        setSeats(seats.map(seat => seat.seat_id === updatedSeat.seat_id ? updatedSeat : seat));
                        setEditingSeat(null);
                        setIsModalOpen(false);
                    }}
                    seat={editingSeat}
                />
            </Modal>
        </div>
    );
};


export default SeatTable;