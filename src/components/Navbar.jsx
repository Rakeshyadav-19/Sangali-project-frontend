import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";

import axios from "axios";
import EventCard from "./EventCard";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      {/* Navbar */}
      <motion.header
        className="glass sticky top-0 z-50 drop-shadow-lg items-center m-auto bg-gradient-to-r  from-[#006494] to-[#00A6FB] border border-[#00A6FB]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            className="lg:text-3xl text-black font-bold tracking-widest uppercase sm:text-5xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Roller Skating Association
          </motion.h1>
          {auth.user ? (
            <div className="relative">
              <motion.button
                className="text-2xl cursor-pointer text-white bg-[#E0E0E0] rounded-full p-2 hover:bg-[#D6D6D6] transition"
                onClick={() => setHovered(!hovered)}
                whileHover={{ scale: 1.1 }}
              >
                👤
              </motion.button>
              {hovered && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="px-4 py-2 text-[#051923] font-medium border-b">
                    {auth.user.name || "User"}
                  </div>
                  <Link
                    to="/my-events"
                    className="btn text-[#051923] hover:bg-[#006494]"
                  >
                    <motion.button
                      className="w-full text-left px-4 py-2 hover:bg-[#006494]"
                      whileHover={{ scale: 1.05 }}
                    >
                      My Events
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    whileHover={{ scale: 1.05 }}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <button
              className="neon-button px-5 py-2 shadow rounded-full font-semibold"
              onClick={() => setShowAuthModal(true)}
            >
              SignIn
            </button>
          )}
        </div>
      </motion.header>
      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
