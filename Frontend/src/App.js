import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateUser from "./components/CreateUser";
import GetUser from "./components/GetUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<CreateUser />} />
          <Route path="/get-user" element={<GetUser />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/delete-user" element={<DeleteUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
