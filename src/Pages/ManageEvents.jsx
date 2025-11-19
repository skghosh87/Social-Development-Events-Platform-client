import React, { useContext, useEffect, useState } from "react";
import Container from "../Components/Container";
import { AuthContext } from "../Context/AuthContext";
import { FaEdit, FaTrash, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// ডেমো ইভেন্ট ডেটা (আপনার ব্যাকএন্ড থেকে এটি লোড হবে)
const mockEvents = [
  {
    _id: "1",
    eventName: "স্থানীয় স্কুল সংস্কার",
    eventDate: "2025-12-10T10:00:00.000Z",
    location: "গুলশান, ঢাকা",
    participants: 15,
    category: "Education",
  },
  {
    _id: "2",
    eventName: "পরিবেশ সচেতনতা ক্যাম্পেইন",
    eventDate: "2025-12-25T14:30:00.000Z",
    location: "ধানমন্ডি, ঢাকা",
    participants: 8,
    category: "Environment",
  },
];

const SERVER_BASE_URL = "http://localhost:5000";

const ManageEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডেটা লোড করার ফাংশন
  const fetchMyEvents = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      // TODO: ইভেন্ট আনার জন্য সঠিক API Endpoint ব্যবহার করুন
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/events/organizer/${user.email}`
      );
      setEvents(response.data.events || mockEvents); // আপাতত mockEvents ব্যবহার করা হয়েছে
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents(mockEvents); // ত্রুটি হলে ডেমো ডেটা
      setLoading(false);
      toast.error("ইভেন্ট লোড করতে সমস্যা হয়েছে।");
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [user]);

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই ইভেন্টটি ডিলিট করতে চান?")) {
      try {
        // TODO: ডিলিট করার API কল যুক্ত করুন
        const response = await axios.delete(
          `${SERVER_BASE_URL}/api/events/${id}`
        );

        if (response.data.success) {
          toast.success("ইভেন্ট সফলভাবে ডিলিট করা হয়েছে।");
          // ডিলিট করার পর তালিকা রিফ্রেশ করা
          fetchMyEvents();
        } else {
          toast.error(response.data.message || "ডিলিট করতে ব্যর্থ।");
        }
      } catch (error) {
        toast.error("সার্ভারের সাথে যোগাযোগ করা যায়নি।");
      }
    }
  };

  // এডিট হ্যান্ডলার (নেভিগেশনের জন্য প্রস্তুত)
  const handleEdit = (id) => {
    // TODO: এডিট পেজে নেভিগেট করার লজিক এখানে যুক্ত হবে
    // navigate(`/edit-event/${id}`);
    toast.info(`ইভেন্ট ID ${id} এডিট করার জন্য প্রস্তুত।`);
  };

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">আপনার ইভেন্টগুলো লোড হচ্ছে...</p>
      </Container>
    );
  }

  // ইভেন্ট না থাকলে Empty State
  if (events.length === 0) {
    return (
      <Container className="py-20 text-center bg-gray-50 rounded-lg shadow-lg">
        <FaCalendarAlt className="text-6xl text-gray-400 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          আপনি কোনো ইভেন্ট তৈরি করেননি।
        </h2>
        <p className="text-gray-500 mt-2">
          একটি নতুন ইভেন্ট তৈরি করে সামাজিক উন্নয়নে আপনার যাত্রা শুরু করুন।
        </p>
        <Link
          to="/create-event"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          ইভেন্ট তৈরি করুন
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 border-b-2 border-blue-500 inline-block mx-auto pb-1">
        আপনার তৈরি করা ইভেন্টগুলো পরিচালনা করুন
      </h1>

      <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ইভেন্টের নাম
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                তারিখ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ক্যাটাগরি
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                অংশগ্রহণকারী
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr
                key={event._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {event.eventName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {event.participants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-3">
                  {/* এডিট বাটন */}
                  <button
                    onClick={() => handleEdit(event._id)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition duration-150"
                    title="Edit Event"
                  >
                    <FaEdit />
                  </button>

                  {/* ডিলিট বাটন */}
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition duration-150"
                    title="Delete Event"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default ManageEvents;
