import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";

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
          toast.success(data.msg);
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
        console.log(data);
        sessionStorage.setItem("user", data.user);
        sessionStorage.setItem("userDetails", data.id);
        if (data.msg) {
          toast.error(data.msg);
        } else {
          navigate("/home");
        }
      })
      .catch((e) => console.log("Error:", e));
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg transition-all duration-500">
        <AiOutlineClose
          className="self-end cursor-pointer hover:bg-red-600 hover:text-white p-1 rounded-full"
          size={30}
          onClick={() => navigate("/")}
        />

        <h1 className="text-2xl font-bold mb-6 text-center">
          {signedUp ? "Signup Form" : "Login Form"}
        </h1>
        <div className="flex mb-6">
          <button
            onClick={SignUps}
            type="button"
            className={`w-1/2 py-2 text-center rounded-l-lg transition-all duration-300 ${
              signedUp ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Signup
          </button>
          <button
            onClick={Login}
            type="button"
            className={`w-1/2 py-2 text-center rounded-r-lg transition-all duration-300 ${
              signedUp ? "bg-gray-200" : "bg-blue-600 text-white"
            }`}
          >
            Login
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signedUp ? SignUserUp() : loginUser();
          }}
          className="space-y-6"
        >
          {signedUp && (
            <input
              type="text"
              name="name"
              placeholder="Username"
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder={signedUp ? "Your email here" : "Email address"}
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Input Password"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg"
          >
            {signedUp ? "Signup" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
