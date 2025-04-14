import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchAllEvents = async () => {
    const res = await axios.get(`${API_BASE}/events`);
    return res.data;
};

export const fetchEventById = async (id) => {
    const res = await axios.get(`${API_BASE}/events/${id}`);
    return res.data;
};
