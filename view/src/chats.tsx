import { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { useMessages } from "./context/MessageContext";
import { useWebSocket } from "./context/SocketContext";

const sender = sessionStorage.getItem("userDetails");

interface Item {
  _id: string;
}

export default function Chats() {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const { messages, setMessages, loading, setLoading } = useMessages();
  const { socket } = useWebSocket();
  const params = useParams();
  const [inputValue, setInputValue] = useState("");
  const [dmId, setDmId] = useState("");
  const [user, setUser] = useState("");
  const [activeChat, setActiveChat] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:1025/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((resp) => {
        const responseData = resp.resp;
        setResponse(responseData);
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (dmId) {
      socket.emit("join", dmId, user);
    }
  }, [dmId, socket, user]);

  function handleClick(item: Item) {
    const receiverId = item._id;
    setActiveChat(receiverId);
    fetch("http://localhost:1025/dm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: sender,
        receiverId: receiverId,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setDmId(data._id);
        navigate(`/dm/${data._id}`);
      })
      .catch((e) => console.error(e));
  }

  useEffect(() => {
    const userName = sessionStorage.getItem("user");
    setUser(userName);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        sender: sender,
        senderName: user,
        room: dmId,
        text: inputValue,
        read: false,
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
          senderName: user,
          msg: inputValue,
        }),
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (params.dmId) {
      setLoading(true);
      fetch(`http://localhost:1025/saved?id=${params.dmId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setMessages(
            data.resp.map((message) => ({ ...message, read: false }))
          );
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.dmId, setMessages, setLoading]);

  useEffect(() => {
    socket.on("msg", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, read: false },
      ]);
    });

    return () => {
      socket.off("msg");
    };
  }, [socket, setMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    const scrollTop = messagesEndRef.current.parentElement.scrollTop;
    const clientHeight = messagesEndRef.current.parentElement.clientHeight;
    const scrollHeight = messagesEndRef.current.parentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.sender !== user && !message.read
            ? { ...message, read: true }
            : message
        )
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-y-hidden">
      <div className="w-[25rem] overflow-y-scroll p-4">
        <h1 className="font-bold text-[3rem] ml-8">Chats</h1>
        <div className="flex ml-9">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="border p-3 pl-10 pr-10 mb-7 rounded-md"
            />
            <FaSearch className="absolute top-4 left-3 text-gray-400" />
          </div>
        </div>
        {response.length ? (
          response
            .filter((item) => item._id !== sender)
            .map((item, index) => (
              <div
                className={`flex p-3 max-w-[20rem] ml-4 rounded-md mb-4 cursor-pointer ${
                  activeChat === item._id
                    ? "bg-blue-200"
                    : "bg-transparent border border-6 border-black"
                }`}
                key={index}
                onClick={() => handleClick(item)}
              >
                <div className="ml-4">
                  <h1 className="font-bold text-[1.3rem]">{item.username}</h1>
                </div>
              </div>
            ))
        ) : (
          <h1>No data to display</h1>
        )}
      </div>
      {dmId.length > 0 ? (
        <div
          className="flex-1 flex flex-col overflow-y-scroll p-4 hideScrollbar"
          onScroll={handleScroll}
        >
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 flex flex-col h-full overflow-y-scroll">
              {messages.length === 0 ? (
                <p>You have no messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      user === message.senderName
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div className="flex flex-col items-end">
                      <h1 className="text-gray-700 font-semibold mb-1">
                        {message.senderName === user
                          ? "You"
                          : message.senderName}
                      </h1>
                      <div
                        className={`${
                          user === message.senderName
                            ? "bg-blue-500"
                            : message.read
                            ? "bg-gray-500"
                            : "bg-green-500"
                        } rounded-br-none text-white rounded-xl py-2 px-4 shadow-md`}
                      >
                        {message.text}
                      </div>
                      <h1>{message.time}</h1>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
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
        <div className="flex-1 flex justify-center items-center">
          <h1>No messages</h1>
        </div>
      )}
    </div>
  );
}
