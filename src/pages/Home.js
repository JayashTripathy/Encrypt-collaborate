import { React, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
//timepass comment
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("please enter both username and password");
      return;
    } else {
      navigate(`/editor/${roomId}`, {
        state: {
          username,
        },
      });
      
    }
  };

  const handleEnterInput = (e) => {

    if(e.code == "Enter"){
    joinRoom();
  }
  }

  return (
    <div className="homepageWrapper">
      <div className="logoWrapper">
        <img src="/logo.png" alt="" />
        <h1 className="logoTitle">Encrypt</h1>
        <h4 className="logoSubtitle">Collaborative 🤝 coding plaform</h4>
      </div>
      <div className="blob">
        <div className="formWrapper">
        <img className="smallDeviceLogo" src="/logo.png" alt="" width="40%" />
          <h4 className="mainLabel">Enter the Playground</h4>
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="Enter Room Id"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
              value={roomId}
              onKeyUp={handleEnterInput}
            />
            <input
              type="text"
              className="inputBox"
              placeholder="Enter Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
              onKeyUp={handleEnterInput}
            />
            <button className="btn joinBtn" onClick={joinRoom} >
              {" "}
              Join
            </button>
            <span className="createInfo">
              To create new room &nbsp;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                Click Here !
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
