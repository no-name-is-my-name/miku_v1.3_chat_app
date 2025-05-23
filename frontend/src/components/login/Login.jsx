import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      console.log("Phản hồi đăng nhập:", response.data); // Debug
      sessionStorage.setItem("username", response.data.username);
      sessionStorage.setItem("userId", response.data.id);
      toast.success("Đăng nhập thành công!");
      // Chuyển hướng đến trang chat sau khi đăng nhập thành công
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data || "Đăng nhập thất bại");
    }
  };
    
  const backtoRegister = () => {
    navigate("/register");
  };

  // const greetingLogin = e => {
  //   e.preventDefault();
  //   toast.warn("Hello world!");
  // }

  return (
    <div className='login'>
        <div className='login-item'>
            <h1>Welcome back</h1>
            <form className='loginForm'>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required/>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className='loginButton' onClick={handleLogin}>Log in</button>
                <button className='loginRegisterButton' onClick={backtoRegister}>Register</button>
            </form>
        </div>
        <div className=''></div>
        <div className='loginWrapper'></div>
    </div>
  )
}

export default Login