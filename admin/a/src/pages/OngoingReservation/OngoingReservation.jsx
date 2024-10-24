import { useState, useEffect } from 'react';
import OngoingReservationTable from '../../components/OngoingReservationTable/OngoingReservationTable';
const apiUrl = import.meta.env.VITE_API_URL;

const OngoingReservation = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers(); 
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/ongoing-reservation-table`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div>
            <OngoingReservationTable user={users} />
        </div>
    );
};

export default OngoingReservation;
