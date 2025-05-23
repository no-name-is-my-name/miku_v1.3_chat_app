import "./Detail.css"
import { useNavigate } from "react-router-dom";

const Detail = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  
  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className='detail'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>{username}</h2>
        <p>Hello, its me Mario.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photo</span>
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
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button className="logout" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  )
}

export default Detail