import React, { useEffect, useState, useRef } from "react";
import ACTIONS from "../Actions";

import { useLocation } from "react-router-dom";
import { RECIEVE_MESSAGE, SEND_MESSAGE } from "../Actions";

function Chat({ trigger, setTrigger, socketRef, roomId }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const username = useLocation().state.username;

  const hoursWithZero = () => {
    var currentHours = new Date(Date.now()).getHours();
    if (currentHours < 10) {
      currentHours = "0" + currentHours;
    } else {
      currentHours = new Date(Date.now()).getHours();
    }

    return currentHours;
  };

  const minutesWithZero = () => {
    var currentMinutes = new Date(Date.now()).getMinutes();
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    } else {
      currentMinutes = new Date(Date.now()).getMinutes();
    }

    return currentMinutes;
  };

  

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        roomId: roomId,
        author: username,
        message: currentMessage,
        time: hoursWithZero() + ":" + minutesWithZero(),
        
        
      };
      await socketRef.current.emit(ACTIONS.SEND_MESSAGE, messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
     
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECIEVE_MESSAGE, (data) => {
        setMessageList((list) => [...list, data]);
      });
    }
  }, [socketRef.current]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return trigger ? (
    <div className="chatBox">
      <div className="chatContent">
        <div className="chatHeader">
          <span className="chatBoxTitle">Live Chat</span>
          <button
            className="closeBtn"
            onClick={() => {
              setTrigger(false);
            }}
          >
            <img src="/times.svg" className="closeBtnIcon" alt="" />
          </button>
        </div>
        <div className="chatBody">
          {messageList.map((messageContent) => {
            return (
              <div className="messageContainer" key={Math.random()}>
                <div
                  className="messageBox"
                  id={username === messageContent.author ? "YOU" : "OTHER"}
                >
                  <h1
                    className="message"
                    id={
                      username === messageContent.author
                        ? "YOU-COLOR"
                        : "OTHER-COLOR"
                    }
                  >
                    {messageContent.message}
                  </h1>
                  <div className="metaData">
                    <h6 className="authorName">{messageContent.author}</h6>
                    <h6 className="messageTiming">{messageContent.time}</h6>
                  </div>
                </div>
                <div ref={messagesEndRef}></div>
              </div>
            );
            
          })}
        </div>
        <div className="chatFooter">
          <input
            className="inputBoxChat"
            type="text"
            value={currentMessage}
            placeholder={`Typing as ${username} ...`}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            onKeyPress={(e) => {
              e.key === "Enter" && sendMessage();
            }}
          />
          <button
            className="btn msgSendBtn"
            id="closeBtn"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Chat;
