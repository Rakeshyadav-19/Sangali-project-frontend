import { useEffect, useState } from "react";
import { fetchAllEvents } from "../api/eventApi";
import { Link } from "react-router-dom";

const Home = () => {
    // const [showModal, setShowModal] = useState(false);
    // const [isLogin, setIsLogin] = useState(true);

    // const toggleModal = (open) => setShowModal(open);
    // const showLogin = () => setIsLogin(true);
    // const showRegister = () => setIsLogin(false);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchAllEvents();
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            }
        };
        loadEvents();
    }, []);

    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-yellow-500 tracking-wide">🏆 Sports Club</h1>
                    <nav>
                        <ul className="flex items-center space-x-8 text-lg">
                            <li><a href="#" className="hover:text-yellow-500 transition">Home</a></li>
                            <li><a href="#events" className="hover:text-yellow-500 transition">Events</a></li>
                            <li><a href="#register" className="hover:text-yellow-500 transition">Register</a></li>
                            <li>
                                {/* <button onClick={() => toggleModal(true)} className="bg-yellow-500 text-white px-5 py-2 rounded-md shadow hover:bg-yellow-600 transition duration-300">
                                    Login/Register
                                </button> */}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Upcoming Sports Events</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
                            <img src={event.image_url} alt={event.title} className="h-40 w-full object-cover rounded-md mb-3" />
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                            <p className="text-gray-600">{event.location}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(event.start_date).toLocaleDateString()} to {new Date(event.end_date).toLocaleDateString()}
                            </p>
                            <Link to={`/events/${event.id}`}>
                                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
};

export default Home;
