
import { NavLink } from 'react-router-dom';
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css';
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const changeHandler = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
}

const handleSubmitButton = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    localStorage.setItem("token", result.token)
    console.log(result);
    navigate('/home');
    alert('successfully logged in')
  } catch (error) {
    console.error("Error: ", error);
    alert('invalid credentials')
  }
};

  return (
    <>
      <section className='container'>
        <div className="login-container">
        <div className="login-title">Login</div>
            <input type="email" name='email' placeholder='email' onChange={changeHandler} value={formData.email}
            className="login-input"/>
            <input type="password" name='password' placeholder='password' onChange={changeHandler} value={formData.password}
            className="login-input"/>
              {/* or navlink? IDK :< */}
            {/* {onClick={(e) => {handleSubmitButton(e)}} pwede sa button or sa form since submit type naman yung button basta nasa loob ng form} */}
            <button type='submit' onClick={(e) => {handleSubmitButton(e)}} className="login-button">Login</button>
        </div>

      </section>
    </>
  );
};

export default Login;

