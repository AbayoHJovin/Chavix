import {  useEffect, useState } from "react";
// import { io } from "socket.io-client";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const sender = sessionStorage.getItem("userDetails");

export default function Chats() {
  const [response, setResponse] = useState([]);
  const navigate =  useNavigate()

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
  function handleclick(item) {
    const receiver = item._id;
    fetch("http://localhost:1025/dm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: sender,
        receiverId: receiver,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
       navigate(`/dm/${data._id}`)
      })
      .catch((e) => console.error(e));
  }
  return (
    <div>
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
      <div className=" w-[25rem] overflow-y-scroll rounded p-4 hideScrollbar">
        {response.length && response ? (
          response
            .filter((item) => item._id !== sender)
            .map((item, index) => (
              <div
                className="flex bg-pink-200 p-3 max-w-[20rem] ml-4 rounded-md mb-4 cursor-pointer"
                key={index}
                onClick={() => handleclick(item)}
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
    </div>
  );
}
