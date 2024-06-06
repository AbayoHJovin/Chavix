import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Chats from "./chats";

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const dm = localStorage.getItem("dmId");
    if (!dm) {
      console.log("no dm found");
    }
  }, []);
  useEffect(() => {
    const userName = sessionStorage.getItem("user");
    setUser(userName);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar user={user} />
      <Chats />
    </div>
  );
}
