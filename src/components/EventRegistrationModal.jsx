// src/components/EventRegisterModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";

function EventRegisterModal({ event, closeModal, resetOnOpen }) {
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
    team_members: [],
  });

  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Debug: log when modal renders and event changes
  console.log("Modal rendered", event);

  // Initialize formData ONLY when event.id changes AND when modal is first opened
  // useEffect(() => {
  //   if (!event) return;
  //   const isTeamEvent = event.is_team_event;
  //   const maxTeamSize = event.max_team_size || 0;
  //   setFormData({
  //     coach_name: "",
  //     club_name: "",
  //     gender: "",
  //     age_group: "",
  //     first_name: "",
  //     middle_name: "",
  //     last_name: "",
  //     dob: "",
  //     district: "",
  //     category: "",
  //     aadhaar_number: "",
  //     team_name: "",
  //     team_members: isTeamEvent
  //       ? Array(Math.max(0, maxTeamSize - 1)).fill("")
  //       : [],
  //   });
  //   setAadhaarImage(null);
  //   setError(null);
  // }, [event?.id]);

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

  // Only reset form when modal is first opened (when showRegister goes from false to true)
  // We'll add a prop to control this: resetOnOpen
  useEffect(() => {
    if (!event || !resetOnOpen) return;
    const isTeamEvent = event.is_team_event;
    const maxTeamSize = event.max_team_size || 0;
    setFormData({
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
      team_members: isTeamEvent
        ? Array(Math.max(0, maxTeamSize - 1)).fill("")
        : [],
    });
    setAadhaarImage(null);
    setError(null);
  }, [event?.id, resetOnOpen]);

  const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);

  const validateForm = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim())
      return "First and Last Name are required.";
    if (!formData.gender) return "Gender is required.";
    if (!formData.age_group.trim()) return "Age group is required.";
    if (!formData.dob) return "Date of birth is required.";
    if (!formData.district.trim()) return "District is required.";
    if (!formData.category) return "Category is required.";
    if (
      !formData.aadhaar_number.trim() ||
      !validateAadhaar(formData.aadhaar_number)
    )
      return "Valid 12-digit Aadhaar number is required.";
    if (!aadhaarImage) return "Aadhaar image is required.";
    if (isTeamEvent) {
      if (!formData.team_name.trim()) return "Team name is required.";
      if (formData.team_members.some((m) => !m.trim()))
        return "All team member names are required.";
    }
    return null;
  };

  const handleFileChange = (e) => {
    setAadhaarImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.team_members];
      updated[index] = value;
      return { ...prev, team_members: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user) {
      alert("Please login first.");
      closeModal();
      return;
    }
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "team_members" && isTeamEvent) {
        form.append(key, JSON.stringify(value.map((v) => v.trim())));
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

  const Input = ({
    name,
    placeholder,
    type = "text",
    required = true,
    value,
    onChange,
  }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:outline-none focus:ring-2 focus:ring-[#003554] transition-all bg-white text-gray-800"
      required={required}
      aria-label={placeholder}
      autoComplete="off"
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
                      autoComplete="off"
                    >
                      <Input
                        name="coach_name"
                        placeholder="Coach Name"
                        value={formData.coach_name}
                        onChange={handleChange}
                      />
                      <Input
                        name="club_name"
                        placeholder="Club Name"
                        value={formData.club_name}
                        onChange={handleChange}
                      />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:ring-2 focus:ring-[#003554] bg-white text-gray-800"
                        required
                        aria-label="Gender"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <Input
                        name="age_group"
                        placeholder="Age Group"
                        value={formData.age_group}
                        onChange={handleChange}
                      />
                      <Input
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      <Input
                        name="middle_name"
                        placeholder="Middle Name (optional)"
                        required={false}
                        value={formData.middle_name}
                        onChange={handleChange}
                      />
                      <Input
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      <Input
                        type="date"
                        name="dob"
                        placeholder="DOB"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                      <Input
                        name="district"
                        placeholder="District"
                        value={formData.district}
                        onChange={handleChange}
                      />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] focus:ring-2 focus:ring-[#003554] bg-white text-gray-800"
                        required
                        aria-label="Category"
                      >
                        <option value="">Select Category</option>
                        <option value="quad">Quad</option>
                        <option value="inline">Inline</option>
                        <option value="beginner">Beginner</option>
                      </select>
                      <Input
                        name="aadhaar_number"
                        placeholder="Aadhaar Number"
                        value={formData.aadhaar_number}
                        onChange={handleChange}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded-xl border border-[#006494] bg-white text-gray-800"
                        required
                        aria-label="Aadhaar Image"
                      />

                      {/* Team Fields */}
                      {isTeamEvent && (
                        <>
                          <Input
                            name="team_name"
                            placeholder="Team Name"
                            type="text"
                            value={formData.team_name}
                            onChange={handleChange}
                          />
                          {formData.team_members.map((member, index) => (
                            <Input
                              key={`member-${index}`}
                              name={`team_member_${index}`}
                              placeholder={`Member ${index + 2} Name`}
                              value={member}
                              onChange={(e) =>
                                handleMemberChange(index, e.target.value)
                              }
                              required={true}
                            />
                          ))}
                        </>
                      )}

                      <div className="col-span-full mt-4 text-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
                            loading
                              ? "bg-[#006494] opacity-70 cursor-not-allowed"
                              : "bg-[#0582CA] hover:bg-[#006494]"
                          }`}
                          aria-busy={loading}
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

export default React.memo(EventRegisterModal);
