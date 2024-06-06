import { useEffect, useState } from "react";
import { useMessages } from "./context/MessageContext";
import { useNavigate, useParams } from "react-router-dom";
import { BsSendArrowUp } from "react-icons/bs";
import { useWebSocket } from "./context/SocketContext";

export default function DmPage() {
  const navigate = useNavigate();
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
    <div className="flex flex-col h-screen">
      <nav className="bg-blue-500 text-white p-4 sticky top-0">
        <ul className="flex justify-center gap-5">
          <li>
            <a
              href="/"
              className="hover:underline"
              onClick={() => navigate("/home")}
            >
              Home
            </a>
          </li>
          <li>
            <a href="/" className="hover:underline">
              Dms
            </a>
          </li>
          <li>
            <a href="/groups" className="hover:underline">
              Groups
            </a>
          </li>
          <li>
            <a href="/settings" className="hover:underline">
              Settings
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex-1 p-4 overflow-y-auto">
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
      </div>
    </div>
  );
}
