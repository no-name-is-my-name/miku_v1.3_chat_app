import AddUser from "./addUser/AddUser";
import "./ChatList.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatList = ({ onSelectUser }) => {
  const [addMode, setAddMode] = useState(false);
  const [users, setUsers] = useState([]);
  const username = sessionStorage.getItem("username");

  // Lấy danh sách tất cả người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/all");
        console.log("Danh sách người dùng:", response.data); // Debug
        setUsers(response.data.filter((u) => u.username !== username));
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      }
    };
    fetchUsers();
  }, [username]);

  const handleSelectUser = (user) => {
    console.log("Chọn người dùng:", user); // Debug
    if (typeof onSelectUser === "function") {
      onSelectUser(user);
    } else {
      console.error("onSelectUser không phải là hàm");
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" name="search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./p1.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className="item"
          onClick={() => handleSelectUser(user)}
        >
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>Hey! How are you?</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;