import AddUser from "./addUser/AddUser";
import "./ChatList.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatList = ({ onSelectUser }) => {
  const [addMode, setAddMode] = useState(false);
  const [friends, setFriends] = useState([]);
  const userId = sessionStorage.getItem("userId");

  // Lấy danh sách tất cả người dùng
  const fetchFriends = async () => {
        try {
            const response = await axios.get(`/api/users/friends/${userId}`);
            const friendsData = response.data.map((friend) => ({
                ...friend,
                avatarUrl: null,
            }));

            // Lấy avatar cho từng bạn bè
            for (let friend of friendsData) {
                try {
                    const avatarResponse = await axios.get(`/api/users/avatar/${friend.id}`, {
                        responseType: "blob",
                    });
                    friend.avatarUrl = URL.createObjectURL(avatarResponse.data);
                } catch (err) {
                    friend.avatarUrl = "./avatar.png";
                }
            }

            setFriends(friendsData);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách bạn bè:", err);
        }
    };

  useEffect(() => {
        fetchFriends();

        const client = Stomp.over(() => new SockJS("/ws"));
        client.connect({}, () => {
            client.subscribe(`/topic/friends/${userId}`, (message) => {
                const updatedFriends = JSON.parse(message.body);
                setFriends((prevFriends) =>
                    updatedFriends.map((friend) => {
                        const existingFriend = prevFriends.find((f) => f.id === friend.id);
                        return {
                            ...friend,
                            avatarUrl: existingFriend ? existingFriend.avatarUrl : "./avatar.png",
                        };
                    })
                );
            });
        });

        return () => client.deactivate();
    }, [userId]);

  const handleSelectUser = (friend) => {
    console.log("Chọn người dùng:", friend); // Debug
    if (typeof onSelectUser === "function") {
      onSelectUser(friend);
    } else {
      console.error("onSelectUser không phải là hàm");
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Tìm kiếm" name="search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./p1.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="item"
          onClick={() => handleSelectUser(friend)}
        >
          <img 
            src={friend.avatarUrl || "./avatar.png"}
            alt={friend.username}
            onError={(e) => (e.target.src = "./avatar.png")} />
          <div className="texts">
            <span>{friend.username}</span>
            <p>{friend.onlineStatus ? "Trực tuyến" : "Ngoại tuyến"}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser onFriendAdded={fetchFriends}/>}
    </div>
  );
};

export default ChatList;