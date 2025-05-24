import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import EventRegisterModal from "../components/EventRegistrationModal";
import GoogleMapReact from "google-map-react";
import Footer from "../components/footer";

const MapMarker = ({ text }) => (
  <div className="text-red-600 font-bold text-xl drop-shadow-lg">📍 {text}</div>
);

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

  const closeModal = useCallback(() => setShowRegister(false), []);
  console.log("EventDetails rendered");
  const memoEvent = useMemo(() => event, [event]);

  // Track previous showRegister to detect when modal is opened
  const [wasOpen, setWasOpen] = useState(false);
  useEffect(() => {
    if (showRegister && !wasOpen) setWasOpen(true);
    if (!showRegister && wasOpen) setWasOpen(false);
  }, [showRegister, wasOpen]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading event details...
      </p>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!event)
    return <p className="text-center text-gray-500 mt-10">Event not found.</p>;

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
    latitude,
    longitude,
  } = event;
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
  const formattedDate = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <>
      <section
        className="p-6 sm:p-10 rounded-lg shadow-lg text-center max-w-360 m-auto"
        style={{ background: "linear-gradient(to right, #4e54c8, #8f94fb)" }}
      >
        <div className="text-white">
          <img
            src={image_url || "/placeholder-image.jpg"}
            alt={title || "Event image"}
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
          />

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center">
              {title || "Unnamed Event"}
            </h1>
            <p className="text-lg text-center mb-6 opacity-90">
              {description || "No description available."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left m-auto max-w-4xl ">
              <div className="space-y-4 text-base sm:text-lg">
                <p>
                  <strong>📍 Venue:</strong> {venue || "TBD"}
                </p>
                <p>
                  <strong>🗺 Location:</strong> {location || "TBD"}
                </p>
                <p>
                  <strong>📅 Dates:</strong> {formattedDate || "TBD"}
                </p>
              </div>
              <div className="space-y-4 text-base sm:text-lg">
                <p>
                  <strong>👥 Type:</strong>{" "}
                  {is_team_event ? "Team Event" : "Individual Event"}
                </p>
                <p>
                  <strong>💰 Price Per Person:</strong>{" "}
                  {price_per_person ? `₹${price_per_person}` : "Free"}
                </p>
                {is_team_event && (
                  <>
                    <p>
                      <strong>💸 Price Per Team:</strong>{" "}
                      {price_per_team ? `₹${price_per_team}` : "Free"}
                    </p>
                    <p>
                      <strong>👤 Max Team Size:</strong>{" "}
                      {max_team_size || "N/A"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="h-64 w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 relative mt-10">
              {latitude && longitude ? (
                <>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "YOUR_GOOGLE_MAPS_API_KEY" }}
                    defaultCenter={{ lat: latitude, lng: longitude }}
                    defaultZoom={15}
                    options={{
                      styles: [
                        {
                          elementType: "geometry",
                          stylers: [{ color: "#f5f5f5" }],
                        },
                        {
                          elementType: "labels.icon",
                          stylers: [{ visibility: "off" }],
                        },
                        {
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#616161" }],
                        },
                        {
                          elementType: "labels.text.stroke",
                          stylers: [{ color: "#f5f5f5" }],
                        },
                        {
                          featureType: "administrative.land_parcel",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#bdbdbd" }],
                        },
                        {
                          featureType: "poi",
                          elementType: "geometry",
                          stylers: [{ color: "#eeeeee" }],
                        },
                        {
                          featureType: "poi",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#757575" }],
                        },
                        {
                          featureType: "poi.park",
                          elementType: "geometry",
                          stylers: [{ color: "#e5e5e5" }],
                        },
                        {
                          featureType: "poi.park",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#9e9e9e" }],
                        },
                        {
                          featureType: "road",
                          elementType: "geometry",
                          stylers: [{ color: "#ffffff" }],
                        },
                        {
                          featureType: "road.arterial",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#757575" }],
                        },
                        {
                          featureType: "road.highway",
                          elementType: "geometry",
                          stylers: [{ color: "#dadada" }],
                        },
                        {
                          featureType: "road.highway",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#616161" }],
                        },
                        {
                          featureType: "road.local",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#9e9e9e" }],
                        },
                        {
                          featureType: "transit.line",
                          elementType: "geometry",
                          stylers: [{ color: "#e5e5e5" }],
                        },
                        {
                          featureType: "transit.station",
                          elementType: "geometry",
                          stylers: [{ color: "#eeeeee" }],
                        },
                        {
                          featureType: "water",
                          elementType: "geometry",
                          stylers: [{ color: "#c9c9c9" }],
                        },
                        {
                          featureType: "water",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#9e9e9e" }],
                        },
                      ],
                    }}
                  >
                    <MapMarker
                      lat={latitude}
                      lng={longitude}
                      text={venue || "Event Location"}
                    />
                  </GoogleMapReact>
                  <div className="absolute bottom-2 left-2 bg-white p-2 rounded-md shadow-md text-sm">
                    <p className="text-gray-700">
                      📍 {venue || "Event Location"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-black">
                    Map not available for this location.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowRegister(true)}
                className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-all duration-300"
              >
                🚀 Register Now
              </button>
            </div>
          </div>
        </div>

        {showRegister && memoEvent && (
          <EventRegisterModal
            event={memoEvent}
            closeModal={closeModal}
            resetOnOpen={!wasOpen && showRegister}
          />
        )}
      </section>
      <Footer className="mt-auto" />
    </>
  );
}
