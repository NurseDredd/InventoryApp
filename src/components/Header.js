"use client";

import { useState } from "react";
import Link from 'next/link';
import { useAuth } from "@/context/auth";
import AuthForm from "@/components/AuthForm";

export default function Header() {
  const auth = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginToggle = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = () => {
    setShowLogin(false); // Close the login modal
  };

  return (
    <>
      <header className="flex items-center justify-between bg-pink-800 p-4">
        <h1 className="text-3xl font-bold text-white">Inventory App v.1.0</h1>
        {auth.token ? (
          <Link
            href="/"
            onClick={() => auth.logout()}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </Link>
        ) : (
          <button
            onClick={handleLoginToggle}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </header>
      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <AuthForm onLogin={handleLogin} />
        </div>
      )}
    </>
  );
}