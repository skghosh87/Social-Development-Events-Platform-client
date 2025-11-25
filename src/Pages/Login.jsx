import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaSignInAlt } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);
  const { signIn, signInWithGoogle, resetPassword, setLoading, user, loading } =
    useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user) navigate(from);
  }, [user, from, navigate]);

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("অনুগ্রহ করে ইমেল এবং পাসওয়ার্ড লিখুন।");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      toast.success("লগইন সফল হয়েছে!");
      navigate(from);
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Google Login Successful!");
      navigate(from);
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      toast.error("পাসওয়ার্ড রিসেট করতে ইমেল লিখুন।");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("পাসওয়ার্ড রিসেট লিংক আপনার ইমেলে পাঠানো হয়েছে।");
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {" "}
      <div className="w-full max-w-md">
        {" "}
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-green-300">
          {" "}
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6 flex items-center justify-center gap-2">
            {" "}
            <FaSignInAlt className="text-green-500" /> Welcome Back!{" "}
          </h2>
          <form onSubmit={handleSignin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                ref={emailRef}
                name="email"
                placeholder="example@email.com"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition text-gray-900"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition text-gray-900"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-green-600 text-lg"
              >
                {show ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>

            <button
              type="button"
              onClick={handleForgetPassword}
              className="text-sm text-green-600 hover:text-green-800 hover:underline cursor-pointer block text-left pt-1"
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
            >
              {loading ? "Processing..." : "Sign In"}
            </button>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-full bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px w-full bg-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignin}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 mb-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <FcGoogle className="mr-3 text-lg" />
                Sign in with Google
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-sm text-gray-500">
                Don’t have an account?
                <Link
                  to="/register"
                  className="text-green-600 hover:underline font-medium ml-1"
                >
                  Register Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
