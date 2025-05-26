import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({ 
    file: null, 
    url: "" 
  });
  const navigate = useNavigate();

  const backtoLogin = () => {
    navigate("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng điền tên người dùng và mật khẩu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      if (avatar.file) {
        formData.append("avatar", avatar.file);
      }

      const registerResponse = await axios.post('/api/auth/register', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      } );
      console.log("Đăng ký thành công:", registerResponse.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Đăng ký thất bại');
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) { 
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
        return;
    }
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
                  onChange={(e) => setPassword(e.target.value)}
                  required/>
                <label htmlFor='file'>
                  <img src={avatar.url || "./avatar.png"} alt=""/>
                  Upload an image</label>
                <input type='file' id='file' style={{display: 'none'}} onChange={handleChange} /> 
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className='loginButton' onClick={backtoLogin}>Sign in</button>
                <button className='loginRegisterButton' onClick={handleRegister}>Register</button>
            </form>
        </div>
    </div>
  )
}

export default Register