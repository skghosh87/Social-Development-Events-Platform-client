import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// FIX 1: AuthContext এর বদলে useAuth হুক import করা হলো
import { useAuth } from "../Context/AuthProvider";
import Container from "../Components/Container";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const SERVER_BASE_URL = "http://localhost:5000";

const EventDetails = () => {
  // 1. স্টেট এবং হুক ব্যবহার
  const { id } = useParams(); // URL থেকে ইভেন্ট ID নেওয়া
  // FIX 2: useAuth থেকে user এবং authLoading নেওয়া হলো
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false); // জয়েনিং প্রসেসের জন্য লোডিং স্টেট
  const [isJoined, setIsJoined] = useState(false); // ইউজার অলরেডি জয়েন করেছে কিনা

  // 2. ইভেন্ট এবং জয়েন স্ট্যাটাস ফেচ করা
  useEffect(() => {
    // প্রমাণীকরণ লোড না হওয়া পর্যন্ত অপেক্ষা করুন
    if (authLoading) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // একক ইভেন্টের বিবরণ ফেচ করা
        const response = await axios.get(`${SERVER_BASE_URL}/api/events/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        toast.error("ইভেন্টের বিবরণ লোড করতে সমস্যা হয়েছে।");
        console.error("Error fetching event details:", error);
        setLoading(false);
        return;
      }
      // ডেটা ফেচ হওয়ার পর ইনিশিয়াল লোডিং বন্ধ করা হচ্ছে
      setLoading(false);
    };

    const checkJoinStatus = async () => {
      // ইভেন্ট ডেটা এবং ইউজার ইমেল না থাকলে চেক করার দরকার নেই
      if (!user?.email || !id) return;

      try {
        // ইউজার এই ইভেন্টে জয়েন করেছে কিনা, তা চেক করা
        // (নোট: এটি একটি অস্থায়ী রুট। অপ্টিমাইজেশনের জন্য একটি নির্দিষ্ট চেক রুট ব্যবহার করা উচিত।)
        const response = await axios.get(
          `${SERVER_BASE_URL}/api/joined-events/${user.email}`
        );
        const joinedEvents = response.data;

        // ইভেন্ট আইডি বা MongoDB ID দিয়ে চেক করা
        const alreadyJoined = joinedEvents.some(
          (e) => e.event_id === id || e._id === id
        );
        setIsJoined(alreadyJoined);
      } catch (error) {
        console.error("Error checking join status:", error);
        // ত্রুটি হলেও isJoined মিথ্যা থাকবে
      }
    };

    // উভয় ফাংশন কল করা
    fetchEventDetails();
    if (user?.email) {
      checkJoinStatus();
    }
  }, [id, user, authLoading, navigate]); // dependency array update করা হয়েছে

  // 3. ইভেন্টে জয়েন করার ফাংশন
  const handleJoinEvent = async () => {
    if (authLoading || !user) {
      toast.warn("ইভেন্টে জয়েন করার আগে অনুগ্রহ করে লগইন করুন।");
      navigate("/login"); // লগইন পেজে নেভিগেট করা
      return;
    }

    if (isJoined) {
      toast.info("আপনি ইতিমধ্যে এই ইভেন্টে জয়েন করেছেন।");
      return;
    }

    setIsJoining(true);

    try {
      const joinData = {
        eventId: id,
        userEmail: user.email,
      };

      const response = await axios.post(
        `${SERVER_BASE_URL}/api/join-event`,
        joinData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setIsJoined(true);
        // ইভেন্ট ডেটা ম্যানুয়ালি আপডেট করা
        setEvent((prevEvent) => ({
          ...prevEvent,
          // participants ফিল্ডটি না থাকলে 0 ধরে নিয়ে 1 যোগ করা
          participants: (prevEvent.participants || 0) + 1,
        }));
      } else {
        toast.error(response.data.message || "জয়েন করতে ব্যর্থ।");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "সার্ভার এরর বা নেটওয়ার্ক সমস্যা।";
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  // 4. শর্তাধীন রেন্ডারিং: লোডিং স্টেট
  if (loading || authLoading) {
    return (
      <Container className="py-20 text-center">
        <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">
          {authLoading
            ? "প্রমাণীকরণ লোড হচ্ছে..."
            : "ইভেন্টের বিবরণ লোড হচ্ছে..."}
        </p>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-20 text-center">
        <FaExclamationCircle className="text-6xl text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          ইভেন্টটি খুঁজে পাওয়া যায়নি।
        </h2>
        <p className="text-gray-500 mt-2">
          অনুগ্রহ করে সঠিক লিঙ্কে প্রবেশ করুন।
        </p>
      </Container>
    );
  }

  // তারিখ এবং সময়ের ফরম্যাটিং
  const eventDate = new Date(event.eventDate);

  // 5. রেন্ডারিং
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.eventName}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full font-semibold shadow-md">
            {event.category}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            {event.eventName}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600 mb-6 border-b pb-4">
            <div className="flex items-center gap-2 font-medium">
              <FaCalendarAlt className="text-blue-500" />
              <p>
                {eventDate.toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <FaMapMarkerAlt className="text-blue-500" />
              <p>{event.location}</p>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <FaUsers className="text-green-600" />
              <p>{event.participants || 0} জন অংশগ্রহণ করেছেন</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            ইভেন্ট সম্পর্কে
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {event.description}
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            আয়োজক তথ্য
          </h3>
          <div className="text-gray-600 space-y-1">
            <p>
              <strong>ইমেল:</strong> {event.organizerEmail}
            </p>
            {/* organizerName নাও থাকতে পারে, তাই শুধু ইমেল দেখানো হলো */}
          </div>

          {/* Join Button */}
          <div className="mt-8 pt-6 border-t">
            {user ? (
              <button
                onClick={handleJoinEvent}
                className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition duration-300 flex items-center justify-center gap-2 ${
                  isJoined
                    ? "bg-green-600 cursor-not-allowed"
                    : isJoining
                    ? "bg-blue-400 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isJoined || isJoining}
              >
                {isJoining ? (
                  <>
                    <FaSpinner className="animate-spin" /> জয়েন করা হচ্ছে...
                  </>
                ) : isJoined ? (
                  <>
                    <FaCheckCircle /> আপনি ইতিমধ্যে জয়েন করেছেন!
                  </>
                ) : (
                  "এই ইভেন্টে জয়েন করুন"
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-6 rounded-lg bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition duration-300"
              >
                জয়েন করতে লগইন করুন
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EventDetails;
