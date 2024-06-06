import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MessageContext } from "./MessageContext";

const SocketContext = React.createContext({ socket: null });

export default SocketContext;

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);
  const { setMessages } = useContext(MessageContext);

  const socket = io("http://localhost:1024", {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  useEffect(() => {
    socket.on("connect", () => {
      if (!connected) {
        setConnected(true);
      }
    });

    console.log(connected);

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("dm", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("dm");
    };
  }, [connected, setMessages, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useWebSocket = () => React.useContext(SocketContext);
