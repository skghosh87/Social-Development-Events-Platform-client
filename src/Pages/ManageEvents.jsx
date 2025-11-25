import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SERVER_BASE_URL = "[http://localhost:5000](http://localhost:5000)"; // প্রয়োজন অনুযায়ী পরিবর্তন করুন

const DeleteConfirmationModal = ({
  isOpen,
  event,
  onClose,
  onDelete,
  isDeleting,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      {" "}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {" "}
        <div className="text-center mb-5">
          {" "}
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-3 animate-pulse" />{" "}
          <h3 className="font-extrabold text-2xl text-red-700">
            ইভেন্ট ডিলিট নিশ্চিত করুন{" "}
          </h3>{" "}
        </div>{" "}
        <p className="py-4 text-gray-700 text-center leading-relaxed">
          আপনি কি নিশ্চিত যে আপনি স্থায়ীভাবে "{" "}
          <span className="font-bold text-red-600">{event.eventName}</span>"
          ইভেন্টটি ডিলিট করতে চান?{" "}
        </p>{" "}
        <div className="flex justify-end mt-6 space-x-3">
          {" "}
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
            disabled={isDeleting}
          >
            বাতিল করুন{" "}
          </button>{" "}
          <button
            onClick={onDelete}
            className="px-6 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                {" "}
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                ডিলিট হচ্ছে...
              </>
            ) : (
              "হ্যাঁ, ডিলিট করুন"
            )}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [organizerEmail, setOrganizerEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // আপনার auth system অনুযায়ী key দিন
    if (email) setOrganizerEmail(email);
  }, []);

  const fetchEvents = async () => {
    if (!organizerEmail) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/events/organizer/${organizerEmail}`
      );
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizerEmail) fetchEvents();
  }, [organizerEmail]);

  const handleDeleteConfirm = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    if (eventToDelete.organizerEmail !== organizerEmail) {
      toast.error("আপনি এই ইভেন্টটি ডিলিট করার অনুমতি নেই!");
      setIsDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/api/events/${eventToDelete._id}?organizerEmail=${organizerEmail}`
      );
      if (response.data.success) {
        setEvents(events.filter((e) => e._id !== eventToDelete._id));
        toast.success("ইভেন্ট সফলভাবে ডিলিট হয়েছে!");
      } else {
        toast.error("Delete failed: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting event");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event) => {
    if (event.organizerEmail !== organizerEmail) {
      toast.error("আপনি এই ইভেন্টটি আপডেট করার অনুমতি নেই!");
      return;
    }
    window.location.href = `/edit-event/${event._id}`;
  };

  if (!organizerEmail) {
    return (
      <div className="text-center py-20">
        {" "}
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto" />{" "}
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          Organizer Email প্রয়োজন{" "}
        </h2>{" "}
        <p className="text-gray-500 mt-2">ইভেন্ট লোড করতে লগইন করুন।</p>{" "}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        {" "}
        <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto" />{" "}
        <p className="mt-4 text-gray-600 text-lg">
          আপনার ইভেন্টগুলো লোড হচ্ছে...
        </p>{" "}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        {" "}
        <FaCalendarAlt className="text-6xl text-blue-500 mx-auto" />{" "}
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          আপনি কোনো ইভেন্ট তৈরি করেননি।{" "}
        </h2>{" "}
        <p className="text-gray-500 mt-2">
          একটি নতুন ইভেন্ট তৈরি করে সামাজিক উন্নয়নে আপনার যাত্রা শুরু করুন।{" "}
        </p>
        <button
          onClick={() => (window.location.href = "/create-event")}
          className="mt-6 inline-block bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
        >
          নতুন ইভেন্ট তৈরি করুন{" "}
        </button>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {" "}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {" "}
        <div className="text-center mb-10">
          {" "}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 border-b-4 border-blue-500 pb-2 inline-block">
            আপনার তৈরি করা ইভেন্টসমূহ{" "}
          </h1>{" "}
          <p className="text-gray-600 mt-2 text-lg">
            Organizer Email:{" "}
            <span className="font-semibold text-blue-600">
              {organizerEmail}
            </span>{" "}
            | মোট ইভেন্ট: {events.length}টি{" "}
          </p>{" "}
        </div>
        <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-800 uppercase">
                  Participants
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-800 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {event.eventName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(event.eventDate).toLocaleString("bn-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">{event.category}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    {event.participants || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-right flex justify-center space-x-3">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(event)}
                      className={`p-2 rounded-full ${
                        event.organizerEmail === organizerEmail
                          ? "text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600"
                          : "text-gray-400 bg-gray-100 cursor-not-allowed"
                      }`}
                      title="Edit Event"
                      disabled={event.organizerEmail !== organizerEmail}
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteConfirm(event)}
                      className={`p-2 rounded-full ${
                        event.organizerEmail === organizerEmail
                          ? "text-red-600 hover:text-white bg-red-100 hover:bg-red-600"
                          : "text-gray-400 bg-gray-100 cursor-not-allowed"
                      }`}
                      title="Delete Event"
                      disabled={
                        isDeleting || event.organizerEmail !== organizerEmail
                      }
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        event={eventToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageEvents;
