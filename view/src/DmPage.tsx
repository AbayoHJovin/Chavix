import { useEffect, useState } from "react";
import { useMessages } from "./context/MessageContext";
import { useParams } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { useWebSocket } from "./context/SocketContext";
import Navbar from "./navbar";
const user = sessionStorage.getItem("user");
export default function DmPage() {
  // const navigate = useNavigate();
  const { messages, setMessages, loading, setLoading } = useMessages();
  const { socket } = useWebSocket();
  const params = useParams();
  const [inputValue, setInputValue] = useState("");
  const [dmId, setdmId] = useState("");
  const [, setUser] = useState("");

  useEffect(() => {
    const dm = localStorage.getItem("dmId");
    if (!dm) {
      console.log("no dm found");
    }
    setdmId(dm);
  }, []);
  useEffect(() => {
    const userName = sessionStorage.getItem("user");
    setUser(userName);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        text: inputValue,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("msg", newMessage);
      setInputValue("");
      fetch("http://localhost:1025/msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dm: dmId,
          msg: inputValue,
        }),
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:1025/saved?id=${params.dmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setMessages(data.resp);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false);
      });
  }, [params, setMessages, setLoading]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar user={user} />
      {/* <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gray-100 mx-36 flex flex-col h-screen ">
          {messages.length === 0 ? (
            <p>you have no messages yet</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="flex justify-end mb-2">
                <div className="bg-blue-500 rounded-br-none text-white rounded-xl py-2 px-4">
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center p-4 border-t border-gray-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 rounded-lg p-2 mr-2 border focus:outline-none"
            placeholder="Type your message..."
          />
          <BsSendArrowUp
            onClick={handleSendMessage}
            className="fill-blue-500"
            size={40}
          />
        </div>
      </div> */}
      {dmId.length > 0 ? (
        <div className="flex-1 flex flex-col overflow-y-scroll p-4 hideScrollbar">
          <div className="flex-1 p-4 overflow-y-auto mb-4">
            <div className="bg-gray-100 flex flex-col h-full overflow-y-scroll">
              {messages.length === 0 ? (
                <p>You have no messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex justify-start mb-2`}>
                    <div className="flex flex-col my-4">
                      <div className="flex">
                        <h1 className="text-gray-700 mx-4 font-semibold mb-1">
                          {message.senderName === user
                            ? "You"
                            : message.senderName}
                        </h1>
                        <h1>{message.time}</h1>
                      </div>
                      <div
                        className={`${
                          user === message.senderName
                            ? "bg-blue-500 rounded-bl-none"
                            : message.read
                            ? "bg-gray-500"
                            : "bg-green-500 rounded-br-none"
                        }  w-auto text-white rounded-xl py-2 px-4 shadow-md`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div />
            </div>
          </div>
          <div className="flex-none p-4 border-t border-gray-300">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 rounded-lg p-2 mr-2 border focus:outline-none"
                placeholder="Type your message..."
              />
              <BsSend
                onClick={handleSendMessage}
                className="fill-blue-500 cursor-pointer"
                size={40}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="mb-4 text-center">Enjoy chatting</h1>
          {/* Additional content can be added here */}
        </div>
      )}
    </div>
  );
}
