import React, { useState } from "react";
import LoginPage from "./login/LoginPage";
import Dashboard from "./login/Dashboard";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  return isLoggedIn ? (
    <Dashboard role={userRole} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}