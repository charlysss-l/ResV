import { NavLink } from 'react-router-dom';
import './Home.css';



const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Launchpad Coworking</h1>
      <p className="home-para">
        At Launchpad Coworking, we redefine the way you work. Discover exceptional spaces designed to elevate your productivity 
        and creativity.
      </p>
      <div className="button-container">
        <NavLink to={'/admin/seat-map'} className="home-availability">
          Check Seat Availability
        </NavLink>
      </div>
    </div>
  );
}

export default Home;
