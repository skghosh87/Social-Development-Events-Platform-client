import React, { useEffect, useState } from "react";

import { useAuth } from "../Context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Container from "../Components/Container";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationCircle,
  FaRegCalendarTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SERVER_BASE_URL = "http://localhost:5000";

const JoinedEvents = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user?.email) {
      const fetchJoinedEvents = async () => {
        try {
          setLoading(true);

          const response = await axios.get(
            `${SERVER_BASE_URL}/api/joined-events/${user.email}`
          );

          setEvents(response.data);
        } catch (error) {
          console.error("Failed to load joined events:", error);
          toast.error("আপনার যুক্ত হওয়া ইভেন্টগুলি লোড করতে ব্যর্থ।");
        } finally {
          setLoading(false);
        }
      };
      fetchJoinedEvents();
    } else if (!user && !authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <Container className="py-20 text-center">
        <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">ইভেন্টগুলি লোড হচ্ছে...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-20 text-center">
        <FaExclamationCircle className="text-6xl text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">লগইন করুন</h2>
        <p className="text-gray-500 mt-2">
          আপনার যুক্ত হওয়া ইভেন্টগুলি দেখতে অনুগ্রহ করে লগইন করুন।
        </p>
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container className="py-20 text-center">
        <FaRegCalendarTimes className="text-6xl text-orange-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          আপনি এখনো কোনো ইভেন্টে যুক্ত হননি।
        </h2>
        <p className="text-gray-500 mt-2">
          নতুন এবং উত্তেজনাপূর্ণ ইভেন্টগুলি খুঁজে দেখতে ইভেন্ট তালিকায় যান!
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          সব ইভেন্ট দেখুন
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        আমার যুক্ত হওয়া ইভেন্টসমূহ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Link
            to={`/event-details/${event.event_id || event._id}`}
            key={event._id || event.event_id}
          >
            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border-2 border-gray-100 h-full flex flex-col">
              <img
                src={
                  event.image ||
                  `https://placehold.co/600x400/2563eb/ffffff?text=${
                    event.eventName.split(" ")[0]
                  }`
                }
                alt={event.eventName}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.target.src = `https://placehold.co/600x400/2563eb/ffffff?text=${
                    event.eventName.split(" ")[0]
                  }`)
                }
              />

              <div className="p-5 flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                  {event.eventName}
                </h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">
                  {event.category || "সাধারণ ইভেন্ট"}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t">
                <button className="w-full text-center text-blue-600 font-bold hover:underline transition">
                  বিস্তারিত দেখুন
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default JoinedEvents;
