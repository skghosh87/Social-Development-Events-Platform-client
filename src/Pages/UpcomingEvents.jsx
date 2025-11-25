import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SERVER_BASE_URL = "http://localhost:5000";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // ⬅️ NEW: সার্চ স্টেট
  const [filterCategory, setFilterCategory] = useState(""); // ⬅️ NEW: ক্যাটাগরি স্টেট
  const navigate = useNavigate();

  // 1. ডেটা ফেচিং লজিক (Query Parameters সহ)
  const fetchUpcomingEvents = async () => {
    setLoading(true);

    // 2. Query Parameters তৈরি করা
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (filterCategory) {
      params.append("category", filterCategory);
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const URL = `${SERVER_BASE_URL}/api/events/upcoming${queryString}`;

    try {
      const response = await axios.get(URL);
      setEvents(response.data.events); // আশা করা হলো সার্ভার থেকে ডেটা আসছে
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      // এখানে মক ডেটা ব্যবহার করা হলো, যদি সার্ভার ডাউন থাকে
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect Hook - Dependency Array তে Query স্টেট যুক্ত করা
  useEffect(() => {
    // এই effect টি তখনই চলবে, যখন searchQuery বা filterCategory পরিবর্তন হবে
    fetchUpcomingEvents();
  }, [searchQuery, filterCategory]); // ⬅️ UPDATED Dependency Array

  const handleJoin = (id) => {
    navigate(`/event-details/${id}`);
  };

  // 4. হ্যান্ডলার ফাংশন
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  return (
    <div className="py-10 bg-gray-50">
      <Container>
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4 flex items-center justify-center gap-3">
          <FaCalendarAlt className="text-blue-500" /> Upcoming Social Events
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Join an event today and be the force for positive change in your
          community.
        </p>

        {/* Search & Filter Bar - Handlers যুক্ত করা হলো */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="flex items-center w-full md:w-2/3 border border-gray-300 rounded-lg p-2 bg-gray-50">
            <FaSearch className="text-gray-400 mx-2" />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full bg-transparent focus:outline-none text-gray-700"
              value={searchQuery} // ⬅️ State value
              onChange={handleSearchChange} // ⬅️ Handler
            />
          </div>
          <div className="flex items-center w-full md:w-1/3">
            <FaFilter className="text-gray-400 ml-2 mr-1" />
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-700"
              value={filterCategory} // ⬅️ State value
              onChange={handleCategoryChange} // ⬅️ Handler
            >
              <option value="">Filter by Category</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        {/* Event Display Logic (Same as before) */}
        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Event Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-lg border border-gray-200">
            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold mt-4 text-gray-700">
              No Event Found!
            </h2>
            <p className="text-gray-500 mt-2">
              Please try different search terms or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200 transform hover:scale-[1.01]"
              >
                {/* Event Card Content (Same as before) */}
                <img
                  src={event.image}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white bg-blue-500">
                    {event.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {event.eventName}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-400" />
                      <p>
                        {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-blue-400" />
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                      <FaUsers className="text-green-500" />
                      <span>{event.participants} Joined</span>
                    </div>
                    <Link to={`/event-details/${event._id}`}>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                        onClick={() => handleJoin(event._id)}
                      >
                        Details & Join
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default UpcomingEvents;
