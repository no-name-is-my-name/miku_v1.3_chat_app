import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const backtoLogin = () => {
    navigate("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Đăng ký thất bại');
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) { 
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
    
  return (
    <div className='register'>
        <div className='register-item'>
            <h1>Create account</h1>
            <form className='loginForm' onSubmit={handleRegister}>
                <input 
                  type='text' 
                  placeholder='Username' 
                  name='username'
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required/>
                <input 
                  type='password' 
                  placeholder='Password' 
                  name='password' 
                  onChange={(e) => setPassword(e.target.value)}
                  required/>
                {/* <label htmlFor='file'>
                  <img src={avatar.url || "./avatar.png"} alt=""/>
                  Upload an image</label>
                <input type='file' id='file' style={{display: 'none'}} onChange={handleChange} /> */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className='loginButton' onClick={backtoLogin}>Sign in</button>
                <button className='loginRegisterButton'>Register</button>
            </form>
        </div>
    </div>
  )
}

export default Register