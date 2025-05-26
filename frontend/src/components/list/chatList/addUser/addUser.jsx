import "./addUser.css"

const AddUser = () => {
  return (
    <div className='addUser'>
      <form className='addUserForm'>
        <input type='text' placeholder='UserID' name="userId"  />
      </form>
      <div className="user">
        <div className="detail">
          <img src="./avatar.png" alt="" />
          <span>Jane Doe</span>
        </div>
        <button>Add</button>
      </div>
    </div>
  )
}

export default AddUser