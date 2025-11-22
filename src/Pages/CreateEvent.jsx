import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Container from "../Components/Container";
import { AuthContext } from "../Context/AuthContext";
import {
  FaCalendarPlus,
  FaRegCalendarAlt,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // <-- নতুন: Axios ইম্পোর্ট করা হলো

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const [eventDate, setEventDate] = useState(new Date());

  // আপাতত লোকালহোস্ট ব্যবহার করা হলো। সার্ভার সেটআপের পর এটি পরিবর্তন করতে হবে।
  const SERVER_BASE_URL = "http://localhost:5000";

  // ফর্ম সাবমিট হ্যান্ডলার (Axios ব্যবহার করে)
  const handleCreateEvent = async (e) => {
    // async ফাংশন করা হলো
    e.preventDefault();
    const form = e.target;

    // ফর্ম ডেটা সংগ্রহ
    const eventData = {
      eventName: form.eventName.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      image: form.image.value,
      // DatePicker থেকে ISO ফরমেটে ডেট পাঠানো
      eventDate: eventDate.toISOString(),
      organizerName: user?.displayName,
      organizerEmail: user?.email,
      postedAt: new Date().toISOString(),
      participants: 0,
    };

    try {
      // Axios দিয়ে POST রিকোয়েস্ট
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/events`,
        eventData
      );

      if (response.data.success) {
        toast.success("🎉 Event Create Successfully!");
        form.reset();
        setEventDate(new Date());
      } else {
        toast.error(response.data.message || "❌ Event Create UnSuccessfully");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Server Error!"}`);
      } else if (error.request) {
        toast.error("Network Error! Please Confirm Server is running।");
      } else {
        toast.error("An unexpected error occurred।");
      }
    }
  };

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-3">
          <FaCalendarPlus className="text-blue-500" /> Create a New Social Event
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Fill in the details below to organize your community's next impactful
          event.
        </p>

        <form onSubmit={handleCreateEvent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title / Name
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="e.g., Local Park Cleanup Drive"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              />
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              >
                <option value="">Select Category</option>
                <option value="Environment">Environment & Ecology</option>
                <option value="Education">Education & Skill Building</option>
                <option value="Health">Health & Wellness</option>
                <option value="Community">Community Building</option>
                <option value="Welfare">Social Welfare</option>
              </select>
            </div>
          </div>

          {/* Image URL and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (For Event Poster)
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://i.imgur.com/your-event-poster.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location / Address
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Dhanmondi Lake, Dhaka"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              />
            </div>
          </div>

          {/* Event Date/Time Picker */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaRegCalendarAlt className="text-blue-500" /> Event Date & Time
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 cursor-pointer"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Please select a future date and time for the event.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the event, objectives, and any prerequisites for participants..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
            ></textarea>
          </div>

          {/* Organizer Info (Read-Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-300">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-600" />
              <p className="text-sm font-medium text-gray-700">
                Organizer:{" "}
                <span className="font-semibold">
                  {user?.displayName || "Loading..."}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-blue-600" />
              <p className="text-sm font-medium text-gray-700">
                Email:{" "}
                <span className="font-semibold">
                  {user?.email || "Loading..."}
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-[1.005]"
          >
            Publish Event
          </button>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default CreateEvent;
