import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EventCard from "../components/EventCard";
import Footer from "../components/footer";

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
      <header className="glass sticky top-0 z-50 shadow-md items-center m-10 rounded-4xl">
        <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl text-black font-bold tracking-widest uppercase">
            🏆 Sports Club
          </h1>
          {auth.user ? (
            <div className="relative">
              <button
                className="text-2xl cursor-pointer"
                onClick={() => setHovered(!hovered)}
              >
                👤
              </button>
              {hovered && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-10">
                  <div className="px-4 py-2 text-gray-800 font-medium border-b">
                    {auth.user.name || "User"}
                  </div>
                  <Link
                    to="/my-events"
                    className="btn text-gray-800 hover:bg-gray-100"
                  >
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      My Events
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Auth">
              <button className="neon-button px-5 py-2 shadow rounded-full hover:scale-105 transition font-semibold">
                Login/Register
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-r  text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-extrabold glow-title mb-6">
            Unleash Your Inner Champion
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-white/80 mb-8">
            Join the Sports Club today and take part in thrilling events all
            year round!
          </p>
          <a
            href="#register"
            className="neon-button px-10 py-4 rounded-full font-semibold text-lg shadow hover:scale-105 transition"
          >
            Register Now
          </a>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className=" m-auto">
          <h3 className="text-4xl font-bold text-center text-blue-500 mb-12">
            Explore Our Featured Events
          </h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-auto w-300 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Register Section */}
    </>
  );
}
