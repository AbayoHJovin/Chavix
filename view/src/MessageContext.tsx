/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const MessageContext = createContext<{
  messages: any[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<any[]>>;
}>({
  messages: [],
  setMessages: () => {},
  loading: false,
  setLoading: () => {},
});

export const MessageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <MessageContext.Provider
      value={{ messages, setMessages, loading, setLoading }}
    >
      {children}
    </MessageContext.Provider>
  );
};
