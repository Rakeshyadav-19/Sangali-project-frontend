import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Auth from "./pages/Auth";
import MyRegisteredEvents from "./components/MyRegisteredEvents";
import "./axios.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyRegisteredEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
