import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Notification from "./components/notification/Notification";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleSelectUser = (user) => {
    console.log("App: Chọn người dùng:", user); // Debug
    setSelectedUser(user);
  };

  const toggleDetail = () => {
    setShowDetail((prev) => !prev);
  };

  return (
    <Router>
      <Notification />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={<div className="container" style={{ display: "flex" }}>
            <List onSelectUser={handleSelectUser} />
            <Chat selectedUser={selectedUser} onToggleDetail = {toggleDetail}/>
            {showDetail && <Detail selectedUser={selectedUser} />}
          </div>}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;