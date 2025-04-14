import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../api/eventApi";

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await fetchEventById(id);
                setEvent(data);
            } catch (err) {
                console.error("Error loading event", err);
            }
        };
        loadEvent();
    }, [id]);

    if (!event) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
            <img src={event.image_url} alt={event.title} className="h-60 w-full object-cover rounded-md mb-4" />
            <p className="text-gray-700">{event.description}</p>
            <p className="mt-2">📍 <strong>Location:</strong> {event.location}</p>
            <p>📅 <strong>Date:</strong> {new Date(event.start_date).toDateString()} - {new Date(event.end_date).toDateString()}</p>

            {/* Next: Register, Pay, Download Ticket */}
            <button className="mt-5 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Register Now
            </button>
        </div>
    );
};

export default EventDetails;
