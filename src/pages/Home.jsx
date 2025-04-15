import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { auth, logout } = useAuth();
    const [hovered, setHovered] = useState(false);

    return (
        <>
            {/* Navbar */}
            <header className="glass sticky top-0 z-50 shadow-md items-center">
                <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl text-black font-bold tracking-widest uppercase">🏆 Sports Club</h1>
                    <nav className=" flex items-center">
                        <ul className="flex space-x-8 text-lg text-black items-center">
                            <li><a href="#" className="hover:text-[#FFDE59] transition">Home</a></li>
                            <li><a href="#events" className="hover:text-[#FFDE59] transition">Events</a></li>
                            <li><a href="#register" className="hover:text-[#FFDE59] transition">Register</a></li>
                            <li><a href="#about" className="hover:text-[#FFDE59] transition">About Us</a></li>
                        </ul>
                    </nav>
                    {auth.user ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <button className="text-2xl cursor-pointer">👤</button>

                            {hovered && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-10">
                                    <div className="px-4 py-2 text-gray-800 font-medium border-b">
                                        {auth.user.name || "User"}
                                    </div>
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
                        <Link
                            to="/Auth"
                        >
                            <button
                                className="neon-button px-5 py-2 shadow rounded-full hover:scale-105 transitionfont-semibold"
                            >
                                Login/Register
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className=" text-center py-24 px-6">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-5xl font-extrabold glow-title mb-6">Unleash Your Inner Champion</h2>
                    <p className="text-xl max-w-2xl mx-auto text-white/80 mb-8">Join the Sports Club today and take part in thrilling events all year round!</p>
                    <a href="#register" className="neon-button px-10 py-4 rounded-full font-semibold text-lg shadow hover:scale-105 transition">Register Now</a>
                </div>
            </section>

            {/* Events Section */}
            <section id="events" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center text-yellow-600 mb-12">
                        Explore Our Featured Events
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Marathon */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
                            <img
                                src="https://images.unsplash.com/photo-1517649763962-0c623066013b"
                                alt="Cycle Marathon"
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <h4 className="text-2xl font-bold text-yellow-500 mb-2">
                                        Cycle Marathon
                                    </h4>
                                    <p className="mb-4">
                                        Join our thrilling cycle marathon and showcase your endurance.
                                    </p>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <span
                                        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 font-semibold transition duration-300"
                                    >
                                        <Link to="/events/cycle-marathon">Event Details</Link>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* More events can be added here in the same format */}
                    </div>
                </div>
            </section>

        </>
    );
}
