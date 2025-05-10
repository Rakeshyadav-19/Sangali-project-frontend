import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "./footer";

const MyRegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get("/api/registrations/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          withCredentials: true,
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Unable to load your registered events.");
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <>
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Registered Events
        </motion.h2>

        {error && (
          <div className="text-center text-red-600 font-semibold mb-6">
            {error}
          </div>
        )}

        {events.length === 0 && !error ? (
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            You haven't registered for any events yet.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {events.map((event) => (
              <motion.div
                key={event.registration_id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <motion.h3
                  className="text-xl font-semibold text-blue-700 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {event.event_name}
                </motion.h3>

                <motion.p
                  className="text-gray-700 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  📅 Date: {event.start_date?.slice(0, 10)}
                </motion.p>

                <motion.p
                  className="text-gray-600 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🏷️ Status:{" "}
                  <span
                    className={`font-medium ${
                      event.status === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </motion.p>

                <motion.p
                  className="text-gray-700 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  👤 Participant: {event.first_name} {event.last_name}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
      <Footer />
    </>
  );
};

export default MyRegisteredEvents;
