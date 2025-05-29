import "./Detail.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Detail = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  const [avatarUrl, setAvatarUrl] = useState("./avatar.png");
  
  const fetchAvatar = async () => {
    try {
      const response = await axios.get(`/api/users/avatar/${userId}`, {
        responseType: "blob", // Nhận dữ liệu dưới dạng Blob
      });
      if (response.status === 200) {
        setAvatarUrl(URL.createObjectURL(response.data));
      } else {
        setAvatarUrl("./avatar.png"); // Fallback nếu không tìm thấy
      }
    } catch (err) {
      console.error("Lỗi khi lấy avatar:", err);
      setError("Không thể tải ảnh avatar.");
      setAvatarUrl("./avatar.png");
    }
  };

  useEffect(() => {
      if (userId) fetchAvatar();
    }, [userId]);

  const handleLogout = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
    await axios.post("/api/auth/logout", {username});
    navigate("/login");
  };

  return (
    <div className='detail'>
      <div className="user">
        <img src = {avatarUrl} alt="" />
        <h2>{username}</h2>
        <p>Hello, its me Mario.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Cài đặt</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Riêng tư và trợ giúp</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Ảnh</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photo">
            <div className="photoItem">
              <div className="photoDetail">
                <img 
                  src="./mavuika.png" 
                  alt="" 
                />
                <span>mavuika.png</span>
              </div>
              <img
                src="./download.png"
                alt=""  
                className="icon"
              />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>File</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button>Chặn người dùng</button>
        <button className="logout" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  )
}

export default Detail