import { useState } from "react";
import axios from "axios";
import './changeInfo.css';
import { toast } from "react-toastify";

const ChangeMode = ({ onClose }) => {
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  const [newName, setNewName] = useState(username);

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleChangeAvatar = () => {
    toast.info("Thay đổi avatar!");
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      toast.warn("Tên không được để trống!");
      return;
    }
    try {
      const res = await axios.put(
        `/api/users/${userId}/change-name`,
        { username: newName },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        toast.success("Đổi tên thành công!");
        sessionStorage.setItem("username", newName);
        setTimeout(() => {
          if (onClose) onClose();
          window.location.reload();
        }, 1200);
      } else {
        toast.error("Đổi tên thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div className='changeModeOverlay' onClick={onClose}>
      <div className='changeMode' onClick={handleContentClick}>
        <div className="changeinfo-header">
          <img src="./avatar.png" alt="avatar" className="changeinfo-avatar" />
          <div className="changeinfo-user">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="changeinfo-name"
              maxLength={30}
            />
            <div className="changeinfo-id">User ID: {userId}</div>
          </div>
        </div>
        <div className="changeinfo-actions">
          <button onClick={handleChangeAvatar} className="change-btn">Thay đổi Avatar</button>
          <button onClick={handleChangeName} className="change-btn">Thay đổi Tên</button>
        </div>
        <button className="changeinfo-close" onClick={onClose} title="Đóng">&times;</button>
      </div>
    </div>
  );
};

export default ChangeMode;