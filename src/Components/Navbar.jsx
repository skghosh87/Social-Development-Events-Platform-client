import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";

import MyLink from "./MyLink";
import Container from "./Container";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const DEFAULT_AVATAR = "/Default-User.png";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, signoutUserFunc, loading } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // থিম পরিবর্তনের লজিক
  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  // সাইনআউট লজিক
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

  // প্রোফাইল ড্রপডাউন মেনু
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
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
      >
        <li className="p-2 text-center text-lg font-bold text-green-700 border-b mb-1">
          {user?.displayName || "User Profile"}
        </li>
        <li className="mt-1">
          {" "}
          {/* <-- নতুন আইটেম যোগ করুন */}
          <Link
            to={"/profile-update"}
            className="hover:bg-base-100 font-semibold"
          >
            Update Profile
          </Link>
        </li>
        <li>
          <Link to={"/create-event"} className="hover:bg-base-100">
            Create Event
          </Link>
        </li>
        <li>
          <Link to={"/manage-events"} className="hover:bg-base-100">
            Manage Events
          </Link>
        </li>
        <li>
          <Link to={"/joined-events"} className="hover:bg-base-100">
            Joined Events
          </Link>
        </li>

        <li className="mt-2 border-t pt-2">
          <button
            onClick={handleSignout}
            className="btn btn-error btn-sm  text-white font-semibold hover:bg-red-50 hover:text-red-600 w-full text-center"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );

  // লগইন বাটন
  const SignInButton = (
    <Link to={"/login"}>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold cursor-pointer hover:bg-purple-700 transition duration-300 shadow-md">
        Login
      </button>
    </Link>
  );

  // থিম টগল কম্পোনেন্ট
  const ThemeToggle = (
    <label
      className="swap swap-rotate mr-2 tooltip tooltip-bottom"
      data-tip="Switch Theme"
    >
      <input
        onChange={(e) => handleTheme(e.target.checked)}
        type="checkbox"
        defaultChecked={localStorage.getItem("theme") === "dark"}
        className="toggle border-2 border-white"
      />
    </label>
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

            <span className="font-bold text-2xl text-white hover:text-yellow-400">
              SDEP
            </span>
          </Link>
        </figure>

        <ul className="hidden md:flex items-center gap-4 text-white font-medium">
          <li>
            <MyLink to={"/"}>Home</MyLink>
          </li>
          <li>
            <MyLink to={"/upcoming-events"}>Upcoming Events</MyLink>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {ThemeToggle}

          {!loading && (user ? ProfileDropdown : SignInButton)}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
