import React, { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaGoogle, FaSignInAlt } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Container from "../Components/Container";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [show, setShow] = useState(false);
  const {
    signInWithEmailAndPasswordFunc,
    signInWithEmailFunc,
    sendPassResetEmailFunc,
    setLoading,
    user,
  } = useContext(AuthContext);

  const location = useLocation();

  const from = location.state?.from || "/";
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return;
  }

  const emailRef = useRef(null);

  const handleSignin = (e) => {
    e.preventDefault();
    const email = e.target.email?.value;
    const password = e.target.password?.value;
    setLoading(true);

    signInWithEmailAndPasswordFunc(email, password)
      .then(() => {
        toast.success(
          "Signin successful! Welcome back to Social Development Platform"
        );
        navigate(from);
      })
      .catch((e) => {
        setLoading(false);

        toast.error(
          e.message
            .replace("Firebase: Error (auth/", "")
            .replace(").", "")
            .replaceAll("-", " ")
        );
      });
  };

  const handleGoogleSignin = () => {
    setLoading(true);
    signInWithEmailFunc()
      .then(() => {
        toast.success("Google Signin Successful! ");
        navigate(from);
      })
      .catch((e) => {
        setLoading(false);

        toast.error(
          e.message
            .replace("Firebase: Error (auth/", "")
            .replace(").", "")
            .replaceAll("-", " ")
        );
      });
  };

  const handleForgetPassword = () => {
    const email = emailRef.current?.value;

    if (!email) {
      toast.error("Please enter your email address in the field above.");
      return;
    }

    sendPassResetEmailFunc(email)
      .then(() => {
        toast.success("Check your email to reset password.");
      })
      .catch((e) => {
        setLoading(false);

        toast.error(
          e.message
            .replace("Firebase: Error (auth/", "")
            .replace(").", "")
            .replaceAll("-", " ")
        );
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-green-300">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6 flex items-center justify-center gap-2">
            <FaSignInAlt className="text-green-500" /> Welcome Back!
          </h2>
          <form onSubmit={handleSignin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                Email
              </label>
              <input
                type="email"
                name="email"
                ref={emailRef}
                placeholder="example@email.com"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150  text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
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
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150  text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 mt-2 cursor-pointer text-green-600 text-lg"
              >
                {show ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>

            <button
              className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline cursor-pointer block text-left"
              onClick={handleForgetPassword}
              type="button"
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Sign In
            </button>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-full bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px w-full bg-gray-200"></div>
              </div>

              <button
                onClick={handleGoogleSignin}
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 mb-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <FcGoogle className="mr-3 text-red-500 text-lg" />
                Sign in with Google
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-green-600 hover:underline font-medium"
                >
                  Register Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
