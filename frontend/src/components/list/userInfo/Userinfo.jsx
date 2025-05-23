import "./Userinfo.css"

const Userinfo = ({ onSelectUser }) => {
  const username = sessionStorage.getItem("username");

  return (
    <div className='userInfo'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>{username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div> 
  )
}

export default Userinfo