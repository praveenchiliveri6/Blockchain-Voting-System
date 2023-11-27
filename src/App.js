import Home from "./Home.js";
import Admin from "./components/admin/Admin.js";
import Header from "./components/header/Header.js"
import AddVoter from "./components/addVoter/AddVoter.js"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/footer/Footer.js";
import { useState } from "react";

function App({ }) {

  const [endTime, setRefreshEndTime] = useState(0);
  const refreshEndTime = () => {
    setRefreshEndTime(oldKey => oldKey + 1);
  };

  return (
    <Router>
      <Header endTime={endTime} />
      <Routes>
        <Route path="/" element={<Home refreshEndTime={refreshEndTime} />} />
        <Route path="/admin" element={<Admin refreshEndTime={refreshEndTime} endTime={endTime} />} />
        <Route path="/addVoter" element={<AddVoter refreshEndTime={refreshEndTime} endTime={endTime} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;