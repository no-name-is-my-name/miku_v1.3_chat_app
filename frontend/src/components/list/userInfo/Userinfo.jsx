import "./Userinfo.css"
import { useState, useEffect } from "react";
import axios from "axios";
import ChangeMode from "./changeInfo/changeInfo.jsx";

const Userinfo = ({ onSelectUser }) => {
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  const [changeMode, setChangeMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("./avatar.png");
  const [error, setError] = useState(null);

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

  return (
    <div className='userInfo'>
      <div className="user"> 
        <img src={avatarUrl} alt="" />
        <h2>{username}</h2>
      </div>
      <div className="icons">
        <img 
          src="./more.png" 
          alt="" 
          className="more"
          onClick={() => setChangeMode((prev) => !prev)}
        />
        {changeMode && <ChangeMode onClose={() => setChangeMode(false)} />}
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div> 
  )
}

export default Userinfo