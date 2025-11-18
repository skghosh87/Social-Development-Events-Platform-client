import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";

import MyLink from "./MyLink";
import Container from "./Container";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const DEFAULT_AVATAR = "https://i.ibb.co/5vFwYxS/default-user.png";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, signoutUserFunc, loading } = useContext(AuthContext);

  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Signout successful");
        navigate("/login");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  if (loading) {
    return null;
  }

  const ProfileDropdown = (
    <div className="dropdown dropdown-end relative z-50">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom"
        data-tip={user?.displayName || "Profile"}
      >
        <div className="w-10 rounded-full border-2 border-white">
          <img
            alt={user?.displayName || "User Avatar"}
            src={user?.photoURL || DEFAULT_AVATAR}
          />
        </div>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg bg-white border border-gray-200"
      >
        <li className="p-2 text-center text-lg font-bold text-green-700 border-b mb-1">
          {user?.displayName || "User Profile"}
        </li>

        <li>
          <Link to={"/create-event"} className="hover:bg-green-100">
            Create Event
          </Link>
        </li>
        <li>
          <Link to={"/manage-events"} className="hover:bg-green-100">
            Manage Events
          </Link>
        </li>
        <li>
          <Link to={"/joined-events"} className="hover:bg-green-100">
            Joined Events
          </Link>
        </li>

        <li className="mt-2 border-t pt-2">
          <button
            onClick={handleSignout}
            className="text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 w-full text-center"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );

  const SignInButton = (
    <Link to={"/login"}>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold cursor-pointer hover:bg-purple-700 transition duration-300 shadow-md">
        Login
      </button>
    </Link>
  );

  return (
    <div className="bg-green-600 py-2 shadow-md sticky top-0 z-40">
      <Container className="flex items-center justify-between">
        <figure>
          <Link to="/" className="flex gap-3 items-center">
            <img
              src={logo}
              className="w-[55px] bg-white rounded-full"
              alt="Logo"
            />
            <span className="font-bold text-2xl text-[#0DBEFF] hover:text-yellow-400">
              SDEP
            </span>
          </Link>
        </figure>

        <ul className="hidden md:flex items-center gap-4 text-gray-700 font-medium">
          <li>
            <MyLink to={"/"}>Home</MyLink>
          </li>

          <li>
            <MyLink to={"/upcoming-events"}>Upcoming Events</MyLink>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme Toggler এখানে বা MainLayout এ যুক্ত হবে */}
          {/* <ThemeToggler /> */}

          {/* ইউজার লগইন করা থাকলে ড্রপডাউন দেখাবে, অন্যথায় সাইন-ইন বাটন */}
          {user ? ProfileDropdown : SignInButton}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
