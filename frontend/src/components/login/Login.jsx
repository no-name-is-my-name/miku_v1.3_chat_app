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

  return (
    <div className='login'>
        <div className='login-item'>
            <h1>Chào mừng trở lại</h1>
            <form className='loginForm'>
                <input 
                  type='text' 
                  placeholder='Tên tài khoản' 
                  name='username' 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required/>
                <input 
                  type='password' 
                  placeholder='Mật khẩu'
                  name='password' 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required/>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className='loginButton' onClick={handleLogin}>Đăng nhập</button>
                <button className='loginRegisterButton' onClick={backtoRegister}>Đăng kí</button>
            </form>
        </div>
        <div className=''></div>
        <div className='loginWrapper'></div>
    </div>
  )
}

export default Login