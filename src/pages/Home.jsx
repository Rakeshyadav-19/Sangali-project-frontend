import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EventCard from "../components/EventCard";
import Footer from "../components/footer";
import { motion } from "framer-motion";

export default function Home() {
  const { auth, logout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load events."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setHovered(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.header
        className="glass sticky top-5 z-50 shadow-lg items-center m-5 rounded-4xl bg-gradient-to-r from-[#051923] via-[#006494] to-[#00A6FB] border border-[#00A6FB]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            className="text-3xl text-white font-bold tracking-widest uppercase"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Roller Skating Association
          </motion.h1>
          {auth.user ? (
            <div className="relative">
              <motion.button
                className="text-2xl cursor-pointer text-white bg-[#E0E0E0] rounded-full p-2 hover:bg-[#D6D6D6] transition"
                onClick={() => setHovered(!hovered)}
                whileHover={{ scale: 1.1 }}
              >
                👤
              </motion.button>
              {hovered && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="px-4 py-2 text-[#051923] font-medium border-b">
                    {auth.user.name || "User"}
                  </div>
                  <Link
                    to="/my-events"
                    className="btn text-[#051923] hover:bg-[#006494]"
                  >
                    <motion.button
                      className="w-full text-left px-4 py-2 hover:bg-[#006494]"
                      whileHover={{ scale: 1.05 }}
                    >
                      My Events
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    whileHover={{ scale: 1.05 }}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/Auth">
              <motion.button
                className="neon-button px-5 py-2 shadow rounded-full hover:scale-105 transition font-semibold"
                whileHover={{ scale: 1.1 }}
              >
                Login/Register
              </motion.button>
            </Link>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="text-center py-24 px-6 bg-gradient-to-r text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.h4
            className="text-5xl font-extrabold glow-title mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Unleash Your Inner Champion
          </motion.h4>
          <motion.p
            className="text-xl max-w-2xl mx-auto text-white/90 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Sangli Miraj Kupwad Roller Skating Association, sangli Sai Skating
            Academy, Sangli
          </motion.p>
          <motion.a
            href="#events"
            className="neon-button px-10 py-4 rounded-full font-semibold text-lg shadow "
            whileHover={{ scale: 1.3 }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Register Now
          </motion.a>
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section
        id="events"
        className="py-30 bg-white m-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="m-auto">
          <motion.h3
            className="text-4xl font-bold text-center text-[#00A6FB] mb-12"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Featured Events
          </motion.h3>
          {loading ? (
            <motion.p
              className="text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Loading events...
            </motion.p>
          ) : error ? (
            <motion.p
              className="text-center text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {error}
            </motion.p>
          ) : events.length === 0 ? (
            <motion.p
              className="text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              No events available.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-auto max-w-300 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <Footer className="mt-auto" />
    </>
  );
}
