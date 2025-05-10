import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-600">No registered events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event.registration_id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{event.event_name}</h3>
              <p className="text-sm text-gray-700">
                Date: {event.date?.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-500">Status: {event.status}</p>
              <p className="text-sm mt-2 text-gray-800">
                Participant: {event.first_name} {event.last_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegisteredEvents;
