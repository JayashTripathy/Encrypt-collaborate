import initSocket from "../Socket";
import React, { useState, useRef, useEffect } from "react";
import Editor from "../components/Editor";
import Client from "../components/Client";
import Chat from "../components/Chat";
import ACTIONS from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();

  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [chatPopup, setChatPopup] = useState(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //Listing for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  function toggleChatBtn() {
    let chatButton = document.getElementById("chat-btn");
    let chatStarter = document.getElementById("chat-starter");

    if (chatPopup === false) {
      setChatPopup(true);
      chatStarter.style.backgroundColor = "#eeb600";
    } else if (chatPopup === true) {
      setChatPopup(false);

      chatButton.style.color = "black";
      chatButton.style.color = "black";
      chatStarter.style.backgroundColor = "white";
    }
  }
  return (
    <div className="parent">
      <div className="mainWrap">
        <div className="topContainer">
          <h1 className="logoTitle editorPageTitle">Encrypt</h1>
          <div className="topAside">
            <h3 className="connected">Connected</h3>
            <div className="clientList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
            <div className=" editorPageBtn">
              <button className=" btn copyRoomId asideBtn" onClick={copyRoomId}>
                Copy Room Id
              </button>
              <button className=" btn leaveRoom asideBtn" onClick={leaveRoom}>
                Leave
              </button>
            </div>
          </div>
        </div>
        <div className="bottomContainer">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          ></Editor>
          <Chat
            trigger={chatPopup}
            setTrigger={setChatPopup}
            roomId={roomId}
            socketRef={socketRef}
          />

          {!chatPopup ? (
            <button className="chatStarter" id="chat-starter">
              <div
                className=" btn  chatBtn"
                id="chat-btn"
                onClick={toggleChatBtn}
              >
                Chats
                <img className="chatIcon" src="/chat-icon.png" alt="" />
              </div>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
