// src/components/EventRegisterModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

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
    if (auth.user) checkRegistration();
  }, [auth.user, auth.token, event.title]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMemberChange = (index, value) => {
    const updated = [...formData.team_members];
    updated[index] = value;
    setFormData({ ...formData, team_members: updated });
  };

  const handleFileChange = (e) => setAadhaarImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user) {
      alert("Please login first.");
      closeModal();
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "team_members" && isTeamEvent) {
        form.append(key, JSON.stringify(value.filter((v) => v.trim())));
      } else {
        form.append(key, value);
      }
    });
    form.append("aadhaar_image", aadhaarImage);
    form.append("event_id", event.id);

    try {
      setLoading(true);
      setError(null);
      await axios.post("/api/registrations", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });
      alert("Registered successfully!");
      closeModal();
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const Input = ({ name, placeholder, type = "text", required = true }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:outline-none focus:ring-2 focus:ring-[#003554] transition-all bg-white text-gray-800"
      required={required}
    />
  );

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-8"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                <Dialog.Title className="text-center text-3xl font-extrabold text-[#003554] mb-6">
                  {isRegistered
                    ? `You're already registered for ${event.title}`
                    : `Register for ${event.title}`}
                </Dialog.Title>

                {isRegistered ? (
                  <div className="text-center">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full transition duration-300"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 text-red-600 text-center font-medium">
                        {error}
                      </div>
                    )}
                    <form
                      onSubmit={handleSubmit}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <Input name="coach_name" placeholder="Coach Name" />
                      <Input name="club_name" placeholder="Club Name" />
                      <select
                        name="gender"
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:ring-2 focus:ring-[#003554] bg-white text-gray-800"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <Input name="age_group" placeholder="Age Group" />
                      <Input name="first_name" placeholder="First Name" />
                      <Input
                        name="middle_name"
                        placeholder="Middle Name (optional)"
                        required={false}
                      />
                      <Input name="last_name" placeholder="Last Name" />
                      <Input type="date" name="dob" placeholder="DOB" />
                      <Input name="district" placeholder="District" />
                      <select
                        name="category"
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:ring-2 focus:ring-[#003554] bg-white text-gray-800"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="quad">Quad</option>
                        <option value="inline">Inline</option>
                        <option value="beginner">Beginner</option>
                      </select>
                      <Input
                        name="aadhaar_number"
                        placeholder="Aadhaar Number"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] bg-white text-gray-800"
                        required
                      />

                      {/* Team Fields */}
                      {isTeamEvent && (
                        <>
                          <Input
                            name="team_name"
                            placeholder="Team Name"
                            type="text"
                          />
                          {formData.team_members.map((member, index) => (
                            <input
                              key={index}
                              placeholder={`Member ${index + 2} Name`}
                              value={member}
                              onChange={(e) =>
                                handleMemberChange(index, e.target.value)
                              }
                              className="w-full px-4 py-2 rounded-xl border border-[#006494] bg-white text-gray-800"
                              required
                            />
                          ))}
                        </>
                      )}

                      {/* Submit Button */}
                      <div className="col-span-full mt-4 text-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
                            loading
                              ? "bg-[#006494] opacity-70 cursor-not-allowed"
                              : "bg-[#0582CA] hover:bg-[#006494]"
                          }`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit & Pay ₹
                              {isTeamEvent
                                ? event.price_per_team
                                : event.price_per_person}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
