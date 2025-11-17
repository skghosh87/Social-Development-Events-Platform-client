import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";

const Signin = () => {
  const { signIn, signInWithGoogle } = useAuth();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      await signIn(email, password);

      toast.success("Successfully signed in!");

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);

      const message = err.message
        .replace("Firebase: Error (auth/", "")
        .replace(").", "")
        .replace("-", " ");
      setError(message);
      toast.error(message || "Login failed! Please check credentials.");
    }
  };

  // ২. Google দিয়ে লগইন হ্যান্ডেল
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Successfully signed in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const message = err.message
        .replace("Firebase: Error (auth/", "")
        .replace(").", "")
        .replace("-", " ");
      setError(message);
      toast.error(message || "Google sign in failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="divider my-6 text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center border border-gray-300 p-3 rounded-md font-semibold hover:bg-gray-50 transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            alt="Google logo"
          >
            <path
              d="M12.0001 4.80005C14.7946 4.80005 16.7126 5.95505 17.6521 6.94005L20.4571 4.14505C18.4231 2.22705 15.6551 1.20005 12.0001 1.20005C7.27912 1.20005 3.19712 3.66405 1.25812 7.16405L4.47812 9.61005C5.45412 6.81905 8.42712 4.80005 12.0001 4.80005Z"
              fill="#EA4335"
            />
            <path
              d="M22.0001 12.1201C22.0001 11.4401 21.9441 10.7491 21.8241 10.0891H12.0001V14.1691H17.5501C17.3001 15.6881 16.3401 16.9691 15.0001 17.8441L18.2911 20.3751C20.3701 18.5141 22.0001 15.4261 22.0001 12.1201Z"
              fill="#4285F4"
            />
            <path
              d="M15.0001 17.844C13.8051 18.665 12.4341 19.199 12.0001 19.199C9.07212 19.199 6.55012 17.568 5.48512 15.195L2.27512 17.641C4.38112 21.579 8.67512 24.0001 12.0001 24.0001C15.6261 24.0001 18.6731 22.7931 20.7221 20.8441L18.2911 20.3751C17.0601 21.2181 16.0351 21.8441 15.0001 21.8441Z"
              fill="#FBBC04"
            />
            <path
              d="M5.48512 15.195C5.23412 14.475 5.09912 13.689 5.09912 12.879C5.09912 12.069 5.23412 11.283 5.48512 10.563L2.27512 8.117C1.49612 9.778 1.00012 11.498 1.00012 12.879C1.00012 14.2601 1.49612 15.9801 2.27512 17.6411L5.48512 15.195Z"
              fill="#34A853"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
