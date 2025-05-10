// src/components/EventRegisterModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog } from "@headlessui/react";
import axios from "axios";

export default function EventRegisterModal({ event, closeModal }) {
  const { auth } = useAuth();

  const isTeamEvent = event.is_team_event;
  const maxTeamSize = event.max_team_size || 0;

  const [formData, setFormData] = useState({
    coach_name: "",
    club_name: "",
    gender: "",
    age_group: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    district: "",
    category: "",
    aadhaar_number: "",
    team_name: "",
    team_members: Array(Math.max(0, maxTeamSize - 1)).fill(""),
  });

  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await axios.get(`/api/registrations/my`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const registeredEvents = res.data.map((reg) =>
          reg.event_name.toLowerCase().trim()
        );
        setIsRegistered(
          registeredEvents.includes(event.title.toLowerCase().trim())
        );
      } catch (err) {
        console.error("Error checking registration status:", err);
      }
    };

    if (auth.user) {
      checkRegistration();
    }
  }, [auth.user, auth.token, event.title]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index, value) => {
    const updated = [...formData.team_members];
    updated[index] = value;
    setFormData({ ...formData, team_members: updated });
  };

  const handleFileChange = (e) => {
    setAadhaarImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.user) {
      alert("Please login first.");
      closeModal();
      return;
    }

    const form = new FormData();
    form.append("coach_name", formData.coach_name);
    form.append("club_name", formData.club_name);
    form.append("gender", formData.gender);
    form.append("age_group", formData.age_group);
    form.append("first_name", formData.first_name);
    form.append("middle_name", formData.middle_name || ""); // Optional field
    form.append("last_name", formData.last_name);
    form.append("dob", formData.dob);
    form.append("district", formData.district);
    form.append("category", formData.category);
    form.append("aadhaar_number", formData.aadhaar_number);
    form.append("aadhaar_image", aadhaarImage);
    form.append("event_id", event.id);
    if (isTeamEvent) {
      form.append("team_name", formData.team_name);
      form.append(
        "team_members",
        JSON.stringify(formData.team_members.filter((member) => member.trim()))
      ); // Send as JSON
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/registrations", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`, // Include the token
        },
        withCredentials: true,
      });

      alert("Registered successfully!");
      closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        // Handle server-side validation errors
        setError(
          error.response.data.errors?.map((err) => err.msg).join(", ") ||
            "Something went wrong."
        );
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <Dialog
        open={true}
        onClose={closeModal}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 relative shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-600 text-center">
              You are already registered for {event.title}
            </h2>
            <div className="text-center">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={closeModal}
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 relative shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-600 text-center">
            Register for {event.title}
          </h2>

          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Standard Fields */}
            <input
              name="coach_name"
              placeholder="Coach Name"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              name="club_name"
              placeholder="Club Name"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="gender"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              name="age_group"
              placeholder="Age Group"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              name="middle_name"
              placeholder="Middle Name"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              name="district"
              placeholder="District"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="category"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="quad">Quad</option>
              <option value="inline">Inline</option>
              <option value="beginner">Beginner</option>
            </select>
            <input
              name="aadhaar_number"
              placeholder="Aadhaar Number"
              onChange={handleChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input w-full p-2 border border-gray-300 rounded-md"
              required
            />

            {/* Team Fields */}
            {isTeamEvent && (
              <>
                <input
                  name="team_name"
                  placeholder="Team Name"
                  onChange={handleChange}
                  className="input w-full p-2 border border-gray-300 rounded-md col-span-2"
                  required
                />
                {formData.team_members.map((_, index) => (
                  <input
                    key={index}
                    placeholder={`Member ${index + 2} Name`}
                    value={formData.team_members[index]}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    className="input w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                ))}
              </>
            )}

            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-2 text-center mt-4">
              <button
                type="submit"
                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : `Submit & Pay ₹${
                      isTeamEvent
                        ? event.price_per_team
                        : event.price_per_person
                    }`}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
