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
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Groups() {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [grpName, setGrpName] = useState("");
  const [grpId,setGrpId]=useState("")
  const userId = sessionStorage.getItem("userDetails");
  const user = sessionStorage.getItem("user");

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
  function handleClick(item: Item) {
    const receiverId = item._id;
    setActiveChat(receiverId);
    // fetch("http://localhost:1025/dm", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     senderId: sender,
    //     receiverId: receiverId,
    //   }),
    // })
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     setDmId(data._id);
    //     navigate(`/groupId/${data._id}`);
    //   })
    //   .catch((e) => console.error(e));
  }
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
        toast.success(success.message);
      })
      .catch((e) => {
        toast.error("Error", e);
      });
  }
  return (
    <div>
      <Navbar user={user} />
      <div className="w-[25rem] overflow-y-scroll p-4">
        <h1 className="font-bold text-[3rem] ml-8">Groups</h1>
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
          <h1>Create a new Group</h1>
        </button>
        {response.length ? (
          response.map((item, index) => (
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
                <h1 className="font-bold text-[1.3rem]">{item.groupName}</h1>
              </div>
            </div>
          ))
        ) : (
          <h1>No data to display</h1>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
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
      {/* {grpId.length > 0 ? (
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
      )} */}
    </div>
  );
}
