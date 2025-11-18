import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";
// MyLink কম্পোনেন্ট আপনার কাস্টম লিংক স্টাইল পরিচালনা করে
import MyLink from "./MyLink";
import Container from "./Container";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
// ডিফল্ট ইউজার ইমেজ
const DEFAULT_AVATAR = "https://i.ibb.co/5vFwYxS/default-user.png";

const Navbar = () => {
  const navigate = useNavigate();

  // useContext ব্যবহার করে প্রয়োজনীয় ফাংশন এবং স্টেট নেওয়া হয়েছে
  const { user, signoutUserFunc, loading } = useContext(AuthContext);

  // লগআউট হ্যান্ডলার ফাংশন
  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Signout successful");
        navigate("/signin");
      })
      .catch((e) => {
        // ফায়ারবেস এরর হ্যান্ডলিং যোগ করা যেতে পারে, তবে আপাতত শুধু মেসেজ দেখাচ্ছে
        toast.error(e.message);
      });
  };

  // লোডিং অবস্থায় কিছু রেন্ডার না করা বা একটি হালকা লোডার দেখানো যেতে পারে
  if (loading) {
    return null;
  }

  // লগইন করা ইউজারের জন্য প্রোফাইল ড্রপডাউন মেনু
  const ProfileDropdown = (
    <div className="dropdown dropdown-end relative z-50">
      {/* প্রোফাইল বাটন: ছবিতে হোভার করলে নাম দেখানোর জন্য data-tip ব্যবহার করা হয়েছে */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom"
        data-tip={user?.displayName || "Profile"} // হোভার করে নাম দেখানো (Challenge Rqmt)
      >
        <div className="w-10 rounded-full border-2 border-white">
          <img
            alt={user?.displayName || "User Avatar"}
            src={user?.photoURL || DEFAULT_AVATAR}
          />
        </div>
      </div>

      {/* ড্রপডাউন মেনু কন্টেন্ট */}
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg bg-white border border-gray-200"
      >
        <li className="p-2 text-center text-lg font-bold text-green-700 border-b mb-1">
          {user?.displayName || "User Profile"}
        </li>

        {/* প্রোটেক্টেড রাউটস (চ্যালেঞ্জ রিকোয়ারমেন্ট) */}
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

        {/* লগআউট বাটন */}
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

  // লগআউট করা ইউজারের জন্য সাইন-ইন বাটন
  const SignInButton = (
    <Link to={"/signin"}>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold cursor-pointer hover:bg-purple-700 transition duration-300 shadow-md">
        Login
      </button>
    </Link>
  );

  return (
    <div className="bg-green-600 py-2 shadow-md sticky top-0 z-40">
      <Container className="flex items-center justify-between">
        {/* লোগো/অ্যাপ নাম */}
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

        {/* নেভিগেশন লিংকস */}
        <ul className="hidden md:flex items-center gap-4 text-gray-700 font-medium">
          <li>
            <MyLink to={"/"}>Home</MyLink>
          </li>
          {/* Upcoming Events পাবলিক পেজ, তাই এটি মূল নেভিগেশনে থাকবে */}
          <li>
            <MyLink to={"/upcoming-events"}>Upcoming Events</MyLink>
          </li>
        </ul>

        {/* কন্ডিশনাল Auth বাটন/প্রোফাইল */}
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
