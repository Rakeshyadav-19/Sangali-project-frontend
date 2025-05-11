// components/EventCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EventCard({ event }) {
  if (!event) {
    return <div className="text-red-500">Event data is unavailable.</div>;
  }

  const { id, title, description, image_url, venue, start_date, end_date } =
    event;
  const formattedStartDate = new Date(start_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = new Date(end_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <motion.div
      className="event-card w-90 bg-white max-w-sm m-auto h-110 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between border border-gray-300 hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={image_url || "/placeholder-image.jpg"}
        alt={title || "Event image"}
        className="w-full h-48 object-cover rounded-t-xl"
        loading="lazy"
      />
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-2 truncate">
            {title || "Unnamed Event"}
          </h4>
          <p className="mb-4 text-gray-600 text-sm line-clamp-3">
            {description || "No description available."}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <strong>Venue:</strong> {venue || "TBD"}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Dates:</strong> {formattedDateRange || "TBD"}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-full flex justify-center"
          >
            <Link
              to={`/events/${id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold transition duration-300"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
