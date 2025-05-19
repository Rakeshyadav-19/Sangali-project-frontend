import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import PreviousEventsTimeline from "../components/PreviousEventsTimeline";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Home() {
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

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <motion.section
        className="text-center py-24 px-6 bg-gradient-to-r from-[#00a6fb] to-[#05caa6] text-white m-10 rounded-4xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.h4
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold glow-title mb-6 text-balance text-center"
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
            className="neon-button px-10 py-4 rounded-full font-semibold text-lg shadow"
          >
            Join Now
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

      {/* Previous Events Timeline */}
      <PreviousEventsTimeline />

      {/* Footer */}
      <Footer className="mt-auto" />
    </>
  );
}
