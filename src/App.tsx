import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { PortfolioView } from "./pages/PortfolioView";
import { LogView } from "./pages/LogView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/portfolio/:id" element={<PortfolioView />} />
        <Route path="/portfolio-log/:id" element={<LogView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
