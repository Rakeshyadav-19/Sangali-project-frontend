import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EventRegisterModal from "../components/EventRegistrationModal";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load event details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading event details...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!event) {
    return <p className="text-center text-gray-500">Event not found.</p>;
  }

  const {
    title,
    description,
    image_url,
    venue,
    location,
    start_date,
    end_date,
    is_team_event,
    price_per_person,
    price_per_team,
    max_team_size,
  } = event;

  return (
    <>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <img
          src={image_url || "/placeholder-image.jpg"}
          alt={title || "Event image"}
          className="w-full h-72 object-cover rounded-md mb-6"
          loading="lazy"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-4">
          {title || "Unnamed Event"}
        </h1>
        <p className="mb-4 text-gray-700">
          {description || "No description available."}
        </p>
        <div className="space-y-2 text-gray-800">
          <p>
            <strong>Venue:</strong> {venue || "TBD"}
          </p>
          <p>
            <strong>Location:</strong> {location || "TBD"}
          </p>
          <p>
            <strong>Dates:</strong> {start_date || "TBD"} - {end_date || "TBD"}
          </p>
          <p>
            <strong>Event Type:</strong>{" "}
            {is_team_event ? "Team Event" : "Individual Event"}
          </p>
          <p>
            <strong>Price Per Person:</strong>{" "}
            {price_per_person ? `₹${price_per_person}` : "Free"}
          </p>
          {is_team_event && (
            <>
              <p>
                <strong>Price Per Team:</strong>{" "}
                {price_per_team ? `₹${price_per_team}` : "Free"}
              </p>
              <p>
                <strong>Max Team Size:</strong> {max_team_size || "N/A"}
              </p>
            </>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={() => setShowRegister(true)}
            className="bg-yellow-500 px-6 py-2 rounded-md text-white hover:bg-yellow-600 transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      {showRegister && (
        <EventRegisterModal
          event={event}
          closeModal={() => setShowRegister(false)}
        />
      )}
    </>
  );
}
