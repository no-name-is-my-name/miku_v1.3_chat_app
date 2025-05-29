import "./Chat.css";
import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

const Chat = ({ selectedUser, onToggleDetail }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  const [stompClient, setStompClient] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("./avatar.png");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("selectedUser thay đổi:", selectedUser);
  }, [selectedUser]);

  // Cuộn xuống cuối danh sách tin nhắn
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({behavior: "auto"});
    }
  }, [messages]);

  const fetchAvatar = async () => {
    try {
      const response = await axios.get(`/api/users/avatar/${selectedUser.id}`, {
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
    if (selectedUser) fetchAvatar();
  }, [selectedUser]);

  // Lấy lịch sử tin nhắn
  useEffect(() => {
    if (!selectedUser || !userId || !selectedUser.id) {
      console.log("Không lấy lịch sử tin nhắn: ", { userId, selectedUser });
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const url = `/api/messages/conversation?user1=${userId}&user2=${selectedUser.id}`;
        console.log("Gửi yêu cầu lịch sử tin nhắn tới: ", url);
        const response = await axios.get(url);
        console.log("Lịch sử tin nhắn nhận được:", response.data);
        setMessages(
          response.data
            .map((msg) => ({
              id: msg.id,
              content: msg.content,
              image: msg.content.includes(".png") ? msg.content : null,
              isOwn: msg.sender.id === parseInt(userId),
              sender: msg.sender,
              receiver: msg.receiver,
              createdAt: msg.createdAt,
              timestamp: formatTimestamp(msg.createdAt),
            }))
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        );
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử tin nhắn:", err);
        console.log("Mã trạng thái:", err.response?.status);
        console.log("Phản hồi lỗi:", err.response?.data);
        alert(`Không thể lấy lịch sử tin nhắn: ${err.message}`);
      }
    };
    fetchMessages();

  }, [selectedUser, userId]);

  // Thiết lập WebSocket
  useEffect(() => {
    if (!username || !userId) return;
    const client = Stomp.over(() => new SockJS("/ws"));
    client.connect({}, () => {
      client.subscribe(`/user/${username}/queue/messages`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        const formattedMessage = {
          id: receivedMessage.id,
          content: receivedMessage.content,
          image: receivedMessage.content?.includes(".png") ? receivedMessage.content : null,
          isOwn: receivedMessage.sender?.id === parseInt(userId),
          sender: receivedMessage.sender,
          receiver: receivedMessage.receiver,
          createdAt: receivedMessage.createdAt,
          timestamp: formatTimestamp(receivedMessage.createdAt),
        };
        setMessages((prevMessages) => {
          if (prevMessages.some(msg => msg.id === formattedMessage.id)) return prevMessages;
          return [...prevMessages, formattedMessage];
        });
      });
    });
    setStompClient(client);

    return () => {
      client.disconnect();
      console.log("WebSocket đã ngắt kết nối");
    };
  }, [username, userId]);


  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId || !stompClient || !stompClient.connected) {
      alert("Không thể gửi tin nhắn. Hãy kiểm tra kết nối và nhập nội dung.");
      return;
    }

    if (!selectedUser || !selectedUser.id) {
      alert("Vui lòng chọn người nhận.");
      return;
    }

    const message = {
      sender: { id: parseInt(userId), username },
      receiver: { id: selectedUser.id, username: selectedUser.username },
      content: text,
    };

    try {
      console.log("Gửi tin nhắn qua WebSocket:", message);
      stompClient.send("/app/send", {}, JSON.stringify(message));
      setText("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn WebSocket:", err);
      alert("Gửi tin nhắn thất bại: " + err.message);
    }
  };


  // Định dạng thời gian
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Xử lý emoji
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Log messages để debug render
  useEffect(() => {
    console.log("Render messages:", messages.map((m) => ({ id: m.id, content: m.content })));
  }, [messages]);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={avatarUrl} alt="" />
          <div className="texts">
            <span>{selectedUser ? selectedUser.username : "Chọn người dùng"}</span>
            <p>{selectedUser ? selectedUser.onlineStatus ? "Trực tuyến" : "Ngoại tuyến" : "Ngoại tuyến"}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img 
            src="./info.png" 
            alt=""
            onClick={onToggleDetail} 
          />
        </div>
      </div>
      <div className="center">
        {selectedUser ? (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.isOwn ? "own" : ""}`}>
                {/* {!msg.isOwn && <img src="./avatar.png" alt="" />} */}
                <div className="texts">
                  {msg.image ? (
                    <img src={msg.image} alt="" />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có tin nhắn nào</p>
          )
        ) : (
          <p>Chọn một người dùng để bắt đầu chat</p>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={text}
            name="message"
            onChange={(e) => setText(e.target.value)}
            disabled={!selectedUser}
          />
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <button type="submit" className="sendButton" disabled={!selectedUser}>
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;