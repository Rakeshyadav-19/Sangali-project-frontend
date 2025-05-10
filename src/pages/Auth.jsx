import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SuccessModal from "../components/SuccessModal";
import { motion, AnimatePresence } from "framer-motion";

function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, phone } = formData;
    if (!email || !password || (!isLogin && (!name || !phone))) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const url = isLogin ? "api/auth/login" : "api/auth/register";
      const { data } = await axios.post(url, formData, {
        withCredentials: true,
      });

      if (isLogin && data.token) {
        login(data.token);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/");
        }, 2000);
      } else if (!isLogin && data.message === "User registered successfully") {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsLogin(true);
        }, 2000);
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#051923] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-center mb-6 text-[#003554]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {isLogin ? "Welcome Back 👋" : "Create Your Account"}
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {!isLogin && (
              <>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <motion.input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0582CA] text-[#006494]"
                  onChange={handleChange}
                  value={formData.name}
                  required
                  whileFocus={{ scale: 1.03 }}
                />

                <label htmlFor="phone" className="sr-only">
                  Phone
                </label>
                <motion.input
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0582CA] text-[#006494]"
                  onChange={handleChange}
                  value={formData.phone}
                  required
                  whileFocus={{ scale: 1.03 }}
                />
              </>
            )}

            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <motion.input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0582CA] text-[#006494]"
              onChange={handleChange}
              value={formData.email}
              required
              whileFocus={{ scale: 1.03 }}
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <motion.input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0582CA] text-[#006494]"
              onChange={handleChange}
              value={formData.password}
              required
              whileFocus={{ scale: 1.03 }}
            />

            <motion.button
              type="submit"
              className={`w-full bg-[#0582CA] text-white py-2 rounded-md font-semibold transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#006494]"
              }`}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <motion.p
          className="mt-4 text-center text-sm text-[#003554]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <motion.button
            onClick={toggleForm}
            className="text-[#006494] font-medium cursor-pointer underline underline-offset-2"
            whileHover={{ scale: 1.05 }}
          >
            {isLogin ? "Register here" : "Login here"}
          </motion.button>
        </motion.p>

        {showSuccess && (
          <SuccessModal
            message={
              isLogin ? "Login Successful 🎉" : "Registered Successfully ✅"
            }
            onClose={() => setShowSuccess(false)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default Auth;
