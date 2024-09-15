"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function AuthForm({ onLogin }) { // Add onLogin prop
  const router = useRouter();
  const auth = useAuth();
  const formRef = useRef(null); // Define formRef

  const [email, setEmail] = useState("Email");
  const [password, setPassword] = useState("Password");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { email, password, name };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();

      if (isLogin) {
        // Login was successful
        localStorage.setItem("@library/token", data.token);
        auth.setToken(data.token);
        router.push("/items"); // Redirect after successful login
        onLogin(); // Call onLogin after successful login
      } else {
        // Registration was successful
        setSuccess("Registration successful! Please log in with your new account.");
        setIsLogin(true); // Switch back to login form after registration
      }
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Something went wrong. Please try again.");
    }
  }

   // Handle clicks outside of the form to close it
   useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onLogin(); // Close the modal
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onLogin]);

  return (
    <div ref={formRef}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form className="form bg-white" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label">Email</label>
          <input
            className="form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="form__group">
          <label className="form__label">Password</label>
          <input
            className="form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {!isLogin && (
          <div className="form__group">
            <label className="form__label">Name</label>
            <input
              className="form__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button className="form__button form__button--primary-login">
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="form__text">...or</p>
        <div className="form__group">
          <button
            className="form__button form__button--secondary-register"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;