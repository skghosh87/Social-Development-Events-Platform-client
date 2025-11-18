import React from "react";
import { Link } from "react-router-dom";
import logo from "/Logo.png";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaHandHoldingHeart,
} from "react-icons/fa";
import Container from "../Components/Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white pt-10 pb-6 border-t-4 border-blue-500 shadow-xl">
      <Container className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link
              to="/"
              className="text-3xl font-bold text-blue-400 flex items-center gap-2"
            >
              <img
                src={logo}
                className="w-[55px] bg-white rounded-full"
                alt="Logo"
              />
              <span className="font-bold text-2xl text-[#0DBEFF] hover:text-yellow-400">
                SDEP
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Join us in building a better community. We connect individuals
              with local social development and environmental action
              opportunities.
            </p>

            <div className="flex space-x-4 text-xl">
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/upcoming-events"
                  className="hover:text-white transition duration-300"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  to="/create-event"
                  className="hover:text-white transition duration-300"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-events"
                  className="hover:text-white transition duration-300"
                >
                  Manage Events
                </Link>
              </li>
              <li>
                <Link
                  to="/joined-events"
                  className="hover:text-white transition duration-300"
                >
                  My Joined Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-1">
              Resources
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-1">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-400" />
                <p className="text-sm">support@socialdevplatform.com</p>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-blue-400" />
                <p className="text-sm">+880 1721921623</p>
              </li>
              <li className="text-sm">Empowering Communities Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-4 border-t border-gray-700 text-center">
          <p className="text-sm text-grey-200">
            &copy; {currentYear} Social Development Events Platform. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
