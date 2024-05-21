import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import Chats from "./chats";

export default function App() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [connected, setConnected] = useState(false);
  const [received, setReceived] = useState([]);
  const socket = io("http://localhost:1024");
  const [dmId, setdmId] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState();
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
  useEffect(() => {
    socket.on("connect", () => {
      if (!connected) {
        console.log(socket.id);
        setConnected(true);
      }
    });

    socket.on("receive", (message) => {
      setReceived((prevMessages) => [...prevMessages, message]);
    });

    socket.on("dm", (message) => {
      console.log(message);
      setReceived((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive");
      socket.off("dm");
    };
  }, [connected, socket]);

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar user={user} />
      <Chats />
    </div>
  );
}
