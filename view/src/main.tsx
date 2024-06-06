import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Start from "./start.tsx";
import { MessageContextProvider } from "./context/MessageContext.tsx";
import { SocketContextProvider } from "./context/SocketContext.tsx";
// import DmPage from "./DmPage.tsx";

const router = createBrowserRouter([
  {
    path: "home",
    element: <App />,
  },
  {
    path: "/",
    element: <Start />,
  },

  {
    path: "/dm/:dmId",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MessageContextProvider>
      <SocketContextProvider>
        <RouterProvider router={router} />
      </SocketContextProvider>
    </MessageContextProvider>
  </React.StrictMode>
);
