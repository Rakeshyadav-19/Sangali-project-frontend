import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SuccessModal from "../components/SuccessModal";


function Auth() {
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleForm = () => setIsLogin(!isLogin);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const url = isLogin ? "api/auth/login" : "api/auth/register";
    //         const { data } = await axios.post(url, formData, {
    //             withCredentials: true
    //         });

    //         if (data.token) {
    //             // localStorage.setItem("auth_token", data.token);
    //             login(data.token);
    //             alert("Success!");
    //             navigate("/");
    //         } else if (!isLogin && data.message === "User registered successfully") {
    //             alert("Registered successfully! Please login.");
    //             setIsLogin(true); // Switch to login form after registration 
    //         } else {
    //             alert(data.message || "Something went wrong.");
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         alert("Error occurred");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isLogin ? "api/auth/login" : "api/auth/register";
            const { data } = await axios.post(url, formData, {
                withCredentials: true
            });

            if (isLogin && data.token) {
                login(data.token);
                setShowSuccess(true); // Show modal
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate("/");
                }, 2000);
            } else if (!isLogin && data.message === "User registered successfully") {
                setShowSuccess(true); // Show modal
                setTimeout(() => {
                    setShowSuccess(false);
                    setIsLogin(true); // Switch to login form
                }, 2000);
            } else {
                alert(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-yellow-600">
                    {isLogin ? "Login" : "Register"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 text-amber-600"
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 text-amber-600"
                                onChange={handleChange}
                                required
                            />
                        </>

                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 text-amber-600"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 text-amber-600"
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-black">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button onClick={toggleForm} className="text-yellow-600 font-medium cursor-pointer">
                        {isLogin ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>

            {showSuccess && (
                <SuccessModal
                    message={isLogin ? "Login Successful" : "Registered Successfully"}
                    onClose={() => setShowSuccess(false)}
                />
            )}

        </div>
    );
}

export default Auth;
