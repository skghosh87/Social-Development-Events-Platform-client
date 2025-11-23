import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Container from "../Components/Container";
import { AuthContext } from "../Context/AuthContext";
import { FaEdit, FaSpinner, FaSave } from "react-icons/fa";

const SERVER_BASE_URL = "http://localhost:5000";

const EditEvent = () => {
  // 1. হুকস এবং স্টেটস
  const { id } = useParams(); // URL থেকে ইভেন্ট ID নেওয়া
  const { user } = useContext(AuthContext); // AuthContext থেকে ইউজার ডেটা নেওয়া
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({
    eventName: "",
    category: "",
    eventDate: "",
    location: "",
    description: "",
    image: "",
    // organizerName এবং organizerEmail AuthContext থেকে নেওয়া হবে বা ডেটাবেস থেকে লোড হবে
  });

  // 2. বর্তমান ইভেন্ট ডেটা ফেচ করা
  useEffect(() => {
    const fetchEvent = async () => {
      if (!user?.email) {
        toast.warn("অনুগ্রহ করে লগইন করুন।");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // ইভেন্ট ID ব্যবহার করে ইভেন্টের বিবরণ ফেচ করা
        const response = await axios.get(`${SERVER_BASE_URL}/api/events/${id}`);

        const fetchedEvent = response.data.event;

        // ⭐ ডেটাবেস থেকে প্রাপ্ত ডেটা দিয়ে ফর্ম স্টেট পূরণ করা
        setEventData({
          eventName: fetchedEvent.eventName || "",
          category: fetchedEvent.category || "",
          // ডেট টাইম ফরম্যাট করে ইনপুট ফিল্ডের জন্য উপযোগী করা
          eventDate:
            new Date(fetchedEvent.eventDate).toISOString().slice(0, 16) || "",
          location: fetchedEvent.location || "",
          description: fetchedEvent.description || "",
          image: fetchedEvent.image || "",
        });
      } catch (error) {
        toast.error("ইভেন্টের বিবরণ লোড করতে সমস্যা হয়েছে।");
        console.error("Error fetching event for edit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  // 3. ইনপুট হ্যান্ডলিং
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 4. ফর্ম সাবমিট (আপডেট লজিক)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    const updatedData = {
      ...eventData,
      organizerEmail: user.email,
      // এখানে অন্য কোনো চেক বা ডেটা মডিফিকেশন লাগলে করা যেতে পারে
    };

    try {
      // ⭐ PUT বা PATCH রিকোয়েস্ট ব্যবহার করে ডেটা আপডেট করা
      const response = await axios.put(
        `${SERVER_BASE_URL}/api/events/${id}`,
        updatedData
      );

      if (response.data.success) {
        toast.success("ইভেন্টটি সফলভাবে আপডেট করা হয়েছে!");
        // আপডেটের পর ম্যানেজ ইভেন্ট পেজে ফিরিয়ে নেওয়া
        navigate("/manage-events");
      } else {
        toast.error(response.data.message || "ইভেন্ট আপডেট করতে ব্যর্থ।");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "সার্ভার এরর বা নেটওয়ার্ক সমস্যা।";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 5. রেন্ডারিং
  if (loading) {
    return (
      <Container className="py-20 text-center">
        <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">ইভেন্ট ডেটা লোড হচ্ছে...</p>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          <FaEdit className="text-blue-500" /> ইভেন্ট আপডেট করুন
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ইভেন্টের নাম
            </label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={eventData.eventName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ক্যাটাগরি
              </label>
              <select
                name="category"
                id="category"
                value={eventData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
              >
                <option value="">একটি ক্যাটাগরি নির্বাচন করুন</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
              </select>
            </div>
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                স্থান (Location)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={eventData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              তারিখ ও সময়
            </label>
            <input
              type="datetime-local"
              name="eventDate"
              id="eventDate"
              value={eventData.eventDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ইমেজ URL
            </label>
            <input
              type="url"
              name="image"
              id="image"
              value={eventData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              বিবরণ (Description)
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={eventData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition duration-300 flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> আপডেট করা হচ্ছে...
              </>
            ) : (
              <>
                <FaSave /> ইভেন্ট আপডেট করুন
              </>
            )}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default EditEvent;
