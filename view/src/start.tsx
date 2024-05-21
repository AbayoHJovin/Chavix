import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

export default function Start() {
  const navigate = useNavigate();
  const [signedUp, setSignedUp] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function Login() {
    setSignedUp(false);
  }
  function SignUps() {
    setSignedUp(true);
  }
  function SignUserUp() {
    fetch("http://localhost:1025/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.msg === "Missing details") {
          setSignedUp(true);
        } else {
          setSignedUp(false);
        }
      });
  }
  function loginUser() {
    fetch("http://localhost:1025/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        sessionStorage.setItem("user", data.user);
        sessionStorage.setItem("userDetails", data.id);
        navigate("/home");
      })
      .catch((e) => console.log("Error:", e));
  }
  return (
    <div className=" md:w-[500px]">
      {signedUp ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="px-24 border md:w-[500px] bg-white items-center content-center h-screen ml-[500px]"
        >
          <AiOutlineClose
            className="md:ml-[350px] mb-[100px] hover:bg-red-600 hover:text-white cursor-pointer"
            size={30}
            onClick={() => navigate("/")}
          />

          <h1 className=" font-bold px-10 py-10 md:text-4xl text-black">
            Signup Form
          </h1>
          <div className="border mb-6 rounded-lg">
            <button
              onClick={SignUps}
              type="button"
              className="rounded-lg mr-[0px] bg-blue-600 p-3 px-[60px] text-white"
            >
              Signup
            </button>
            <button
              onClick={Login}
              type="button"
              className="rounded-lg p-3 px-12 text-black"
            >
              Login
            </button>
          </div>
          <div className="flex flex-col md:w-[300px]">
            <input
              type="text"
              name="name"
              placeholder="Username"
              className="border mb-6 p-3 rounded-lg"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="your email here"
              className="border mb-6 p-3 rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="input Password"
              className="border mb-6 p-3 rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={SignUserUp}
              className="bg-blue-900 text-white p-3 mb-6 rounded-lg"
            >
              Signup
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="px-24 border md:w-[500px] bg-white items-center content-center h-screen ml-[500px]"
        >
          <AiOutlineClose
            onClick={() => navigate("/")}
            className="md:ml-[350px] mb-[100px] hover:bg-red-600 hover:text-white cursor-pointer"
            size={30}
          />
          <h1 className=" font-bold px-10 py-10 md:text-4xl text-black">
            Login Form
          </h1>
          <div className="border mb-6 rounded-lg">
            <button
              onClick={SignUps}
              type="button"
              className="rounded-lg mr-[0px] p-3 px-[60px] text-black"
            >
              Signup
            </button>
            <button
              onClick={Login}
              type="button"
              className="rounded-lg p-3 px-12 bg-blue-600 text-white"
            >
              Login
            </button>
          </div>
          <div className="flex flex-col md:w-[300px]">
            <input
              type="email"
              name="mail"
              placeholder="Email address"
              className="border mb-6 p-3 rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="your password here"
              className="border mb-6 p-3 rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={loginUser}
              className="bg-blue-900 text-white p-3 mb-6 rounded-lg"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
