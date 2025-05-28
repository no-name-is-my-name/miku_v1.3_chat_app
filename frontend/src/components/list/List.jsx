import ChatList from "./chatList/ChatList"
import Userinfo from "./userInfo/Userinfo"
import "./List.css"

const List = ({ onSelectUser }) => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList onSelectUser={onSelectUser} />
    </div>
  )
}

export default List