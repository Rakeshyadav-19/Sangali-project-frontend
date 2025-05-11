import React, { useEffect, useState, useRef } from "react";
import { fetchPreviousEvents } from "../api/eventApi";
import { motion, AnimatePresence } from "framer-motion";

const PreviousEventsTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchPreviousEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch previous events:", error);
        setError("Failed to load previous events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [events.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="relative max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center text-[#003554] mb-12">
        Previous Events
      </h2>
      <div className="relative w-full flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Previous"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#003554"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Carousel */}
        <div className="w-full flex justify-center">
          <AnimatePresence initial={false} mode="wait">
            {events.length > 0 && (
              <motion.div
                key={currentIndex}
                className="relative w-full sm:w-80 md:w-96 lg:w-[52rem] h-84 bg-cover bg-center rounded-xl shadow-lg flex flex-col justify-end border-4 border-white"
                style={{
                  backgroundImage: `url(${events[currentIndex].image_url})`,
                  minHeight: "16rem",
                  aspectRatio: "2/1", // Rectangular aspect ratio
                }}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full rounded-b-xl">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {events[currentIndex].name}
                  </h3>
                  <p className="text-white mt-2">
                    {new Date(events[currentIndex].date).toLocaleDateString()}
                  </p>
                  <p className="text-white mt-2">
                    {events[currentIndex].description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Next"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#003554"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full border-2 border-[#003554] transition-all duration-300 ${
              idx === currentIndex ? "bg-[#003554]" : "bg-white"
            }`}
            aria-label={`Go to event ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviousEventsTimeline;
