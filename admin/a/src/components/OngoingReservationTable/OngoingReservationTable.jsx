import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OngoingReservationTable.css';
const apiUrl = import.meta.env.VITE_API_URL;

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
};

const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${strMinutes} ${ampm}`;
};

const OngoingReservationTable = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/history-table`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                // Filter out ended reservations
                const ongoingUsers = data.filter(user => !user.finalEndDate && !user.finalEndTime);
                setUsers(ongoingUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);

    const handleEndClick = (user) => {
        navigate('/admin/add-end-reservation', { state: { user } });
    };

    const handleClickPageNumber = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="conn">
            <h2 className="table-title">Ongoing Reservation</h2>
            <div className="history-container1">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th className="title">Seat Number</th>
                            <th className="title">Name</th>
                            <th className="title">Internet Hours</th>
                            <th className="title">Start Date</th>
                            <th className="title">Start Time</th>
                            <th className="title">Expected End Date</th>
                            <th className="title">Expected End Time</th>
                            <th className="title">End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="data">{user.seatNumber}</td>
                                    <td className="data">{user.name}</td>
                                    <td className="data">{user.internetHours} hr</td>
                                    <td className="data">{formatDate(user.startDate)}</td>
                                    <td className="data">{formatTime(user.startTime)}</td>
                                    <td className="data">{formatDate(user.expectedEndDate)}</td>
                                    <td className="data">{formatTime(user.expectedEndTime)}</td>
                                    <td className="data">
                                        <button 
                                            className="end-button" 
                                            onClick={() => handleEndClick(user)}
                                        >
                                            END
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="data">No users available</td>
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
        </div>
    );
};

export default OngoingReservationTable;
