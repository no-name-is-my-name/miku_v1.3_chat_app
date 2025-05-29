import "./addUser.css"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const AddUser = ({ onFriendAdded}) => {
  const [userId, setUserId] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [username, setUsername] = useState("Jane Doe");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUserId = sessionStorage.getItem("userId");

    const fetchAvatar = async (id) => {
        try {
            const response = await axios.get(`/api/users/avatar/${id}`, {
                responseType: "blob",
            });
            if (response.status === 200) {
                setAvatarUrl(URL.createObjectURL(response.data));
            } else {
                setAvatarUrl("./avatar.png");
            }
        } catch (err) {
            console.error("Lỗi khi lấy avatar:", err);
            setError("Không thể tải ảnh avatar.");
            setAvatarUrl("./avatar.png");
        }
    };

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`/api/users/${id}`);
            if (response.status === 200) {
                setUsername(response.data.username || "Unknown User");
            }
        } catch (err) {
            console.error("Lỗi khi lấy thông tin user:", err);
            setError("Không thể tải thông tin user.");
            setUsername("Unknown User");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError("Vui lòng nhập UserID.");
            return;
        }
        setError(null);
        await fetchUserData(userId);
        await fetchAvatar(userId);

        // Gửi request thêm bạn bè
        try {
            const response = await axios.post(`/api/users/add-friend`, null, {
                params: { userId: currentUserId, friendId: userId },
            });
            if (response.status === 200) {
              if (typeof onFriendAdded === "function") {
                onFriendAdded();
              }
              navigate("/chat");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Không thể thêm bạn bè.");
        }
    };

  return (
    <div className='addUser'>
      <form className='addUserForm'>
        <input 
          type='text' 
          placeholder='UserID' 
          name="userId" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)} 
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type='submit' onClick={handleAdd}>Thêm bạn</button>
      </form>
      <div className="user">
        <div className="detail">
          <img 
            src={avatarUrl || "./avatar.png"}
            alt={username}
            onError={(e) => (e.target.src = "./avatar.png")} />
          <span>{username}</span>
        </div>
      </div>
    </div>
  )
}

export default AddUser