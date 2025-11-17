import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";
import MyLink from "./MyLink";

import Container from "./Container";
import { toast } from "react-toastify";
import { use } from "react";
import { AuthContext } from "../Context/authContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, signoutUserFunc, setUser, loading, setLoading } =
    use(AuthContext);
  console.log(user);

  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Signout successful");

        navigate("/signin");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  console.log(loading);

  return (
    <div className="bg-green-500 py-2 border-b border-b-slate-300 ">
      {" "}
      <Container className="flex items-center justify-between">
        {" "}
        <figure>
          <Link to="/">
            <img
              src={logo}
              className="w-[55px] bg-white rounded-full"
              alt="Logo"
            />
          </Link>{" "}
        </figure>{" "}
        <ul className="flex items-center gap-2">
          {" "}
          <li>
            <MyLink to={"/"}>Home</MyLink>{" "}
          </li>{" "}
          <li>
            <MyLink to={"/create-event"}>Create Event</MyLink>{" "}
          </li>
          <li>
            <MyLink to={"/manage-events"}>Manage Events</MyLink>{" "}
          </li>
          <li>
            <MyLink to={"/joined-events"}>Joined Events</MyLink>{" "}
          </li>{" "}
          <li>
            <MyLink to={"/profile"}>My Profile</MyLink>{" "}
          </li>{" "}
        </ul>{" "}
        <div className="text-center space-y-3">
          {" "}
          <button
            className="btn"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" }}
          >
            {" "}
            <img
              src={"https://via.placeholder.com/88"}
              className="h-10 w-10 rounded-full mx-auto"
              alt="User Avatar"
            />{" "}
          </button>{" "}
          <div
            className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
            popover="auto"
            id="popover-1"
            style={{ positionAnchor: "--anchor-1" }}
          >
            {" "}
            <h2 className="text-xl font-semibold">displayName</h2>
            <p className="text-white/80">email</p>{" "}
            <button onClick={handleSignout} className="my-btn">
              Sign Out{" "}
            </button>{" "}
          </div>{" "}
        </div>
        (
        <button className="bg-purple-500 text-white px-4 py-2 rounded-md font-semibold cursor-pointer">
          <Link to={"/signin"}>Sign in</Link>{" "}
        </button>
        ){" "}
      </Container>{" "}
    </div>
  );
};

export default Navbar;
