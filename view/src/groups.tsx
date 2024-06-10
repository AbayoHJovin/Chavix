import { FaPlus, FaSearch } from "react-icons/fa";
import Navbar from "./navbar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState, useRef,KeyboardEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useMessages } from "./context/MessageContext";
import { useWebSocket } from "./context/SocketContext";
import { BsSend } from "react-icons/bs";

interface Item {
  _id: string;
}
interface Message {
  id: string;
  text: string;
  read?: boolean; 
  room: string;
  user: string;
}

interface ResponseData {
  resp: Message[];
}

export default function Groups() {
  const [open, setOpen] = useState(false);
  const { socket } = useWebSocket();
  const [inputValue, setInputValue] = useState("");
  const { messages, setMessages, loading, setLoading } = useMessages();
  const [response, setResponse] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [grpName, setGrpName] = useState("");
  const [grpId, setGrpId] = useState("");
  const userId = sessionStorage.getItem("userDetails");
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const params = useParams();

  useEffect(() => {
    fetch("http://localhost:1025/showGroups", {
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
  }, [grpName, setGrpName]);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        sender: userId,
        senderName: user,
        room: grpId,
        text: inputValue,
        read: false,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("msg", newMessage);
      console.log(grpId);
      console.log(newMessage);
      setInputValue("");
      fetch("http://localhost:1025/msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dm: grpId,
          senderName: user,
          msg: inputValue,
        }),
      });
    }
  };
  useEffect(() => {
    if (grpId) {
      socket.emit("join", grpId, user);
    }
  }, [grpId, socket, user]);

  function handleClick(item: Item) {
    setActiveChat(item._id);
    fetch("http://localhost:1025/checkIfUserExists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        groupId: item._id,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === `You have joined`) {
          toast.success(data.message);
        }

        setGrpId(item._id);
        navigate(`/group/${item._id}`);
      })
      .catch((e) => console.error(e));
  }
  useEffect(() => {
    socket.on("msg", (newMessage:Message) => {
      // const audio = new Audio('../public/Iphone Message Tone Download - MobCup.Com.Co.mp3');
      // audio.play();
      console.log("Kingkong");
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, read: false },
      ]);
    });

    return () => {
      socket.off("msg");
    };
  }, [socket, setMessages]);
  function handleCreate() {
    fetch("http://localhost:1025/createGrp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grpName: grpName,
        members: userId,
      }),
    })
      .then((response) => response.json())
      .then((success) => {
        setGrpName((prev) => [...prev, success.data]);
        handleClose();
        if (success.message === "Group created successfully") {
          toast.success(success.message);
        } else {
          toast.error("Please Enter a group name");
        }
      })
      .catch((e) => {
        toast.error("Error", e);
      });
  }
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    if (params.grpId) {
      setLoading(true);
      fetch(`http://localhost:1025/saved?id=${params.grpId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data:ResponseData) => {
          setMessages(
            data.resp.map((message) => ({ ...message, read: false }))
          );
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.grpId, setMessages, setLoading]);
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
function handleKeyPress(e:KeyboardEvent<HTMLInputElement>){
  if(e.key=== "Enter"){
    handleSendMessage()
  }
}
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create a new group</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              autoFocus
              margin="dense"
              id="group-name"
              label="Enter the group name"
              type="text"
              fullWidth
              onChange={(e) => setGrpName(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            autoFocus
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
      <Navbar user={user} />
      <div className="flex h-screen overflow-hidden">
        <div className="w-[25rem] overflow-y-scroll p-4 border-r border-gray-300">
          <h1 className="font-bold text-[3rem] ml-8"></h1>
          <div className="flex ml-9">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start a new chat"
                className="border p-3 pl-10 pr-10 mb-7 rounded-md"
                required
              />
              <FaSearch className="absolute top-4 left-3 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleClickOpen}
            className="flex bg-pink-400 p-4 text-center items-center cursor-pointer gap-2 rounded-lg font-bold text-white w-56 m-10"
          >
            <FaPlus />
            <h1 className="sticky">Create a new Group</h1>
          </button>
          <h1 className="font-bold text-[2rem] my-6 ml-8">Available groups</h1>
          <div className="h-[20rem] overflow-y-scroll">
            {response.length ? (
              response.map((item, index) => (
                <div
                  className={`flex p-3 ml-4 rounded-md mb-4 cursor-pointer ${
                    activeChat === item._id
                      ? "bg-blue-200"
                      : "bg-transparent border border-black"
                  }`}
                  key={index}
                  onClick={() => handleClick(item)}
                >
                  <div className="ml-4">
                    <h1 className="font-bold text-[1.3rem]">
                      {item.groupName}
                    </h1>
                  </div>
                </div>
              ))
            ) : (
              <h1>No data to display</h1>
            )}
          </div>
        </div>

        {grpId.length > 0 ? (
          <div
            className="flex-1 flex flex-col overflow-hidden"
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
            <div className="flex-none p-4 border-t border-gray-300 bg-white">
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
    </div>
  );
}
