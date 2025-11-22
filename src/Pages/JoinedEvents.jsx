import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const JoinedEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_BASE_URL = "http://localhost:5000";
  useEffect(() => {
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
          toast.error("Failed to load joined events.");
        } finally {
          setLoading(false);
        }
      };
      fetchJoinedEvents();
    }
  }, [user]);

  if (loading) {
    return <div>Loading joined events...</div>;
  }

  if (events.length === 0) {
    return <div>You haven't joined any events yet.</div>;
  }

  return (
    <div>
      <h2>My Joined Events</h2>

      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.eventName}</h3>
          <p>Location: {event.location}</p>
          <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default JoinedEvents;
