import React, { useState } from "react";
// FIX 1: useContext এবং AuthContext এর বদলে কাস্টম useAuth হুক import করা হলো
import { useAuth } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Container from "../Components/Container";
import { auth } from "../Firebase/firebase.config"; // ⭐ নিশ্চিত করুন এটি আপনার সঠিক পাথ

// পাসওয়ার্ড শক্তিমত্তা পরীক্ষা করার জন্য রেগুলার এক্সপ্রেশন:
// কমপক্ষে ৬ ক্যারেক্টার, একটি আপারকেস এবং একটি লোয়ারকেস অক্ষর থাকতে হবে।
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const ProfileUpdate = () => {
  // FIX 2: useContext(AuthContext) এর বদলে useAuth() ব্যবহার করা হলো
  const { user, loading, setUser } = useAuth();

  // ফর্ম স্টেট
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Re-authentication এর জন্য

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    // যদি ইউজার লগ ইন না থাকে, তবে একটি বার্তা প্রদর্শন করা উচিত
    return (
      <p className="text-center py-20 text-red-500 font-semibold">
        Please log in to update your profile.
      </p>
    );
  }

  // নাম এবং ছবি আপডেটের হ্যান্ডলার
  const handleGeneralUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Firebase updateProfile ফাংশন কল করা
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // AuthContext এর user স্টেট আপডেট করে UI রিফ্রেশ করা
      // মনে রাখবেন, Firebase এর user অবজেক্টটি ইমিউটেবল, তাই নতুন অবজেক্ট তৈরি করতে হবে
      setUser({ ...user, displayName, photoURL });
      toast.success("Profile details updated successfully! 👍");
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  // পাসওয়ার্ড আপডেটের হ্যান্ডলার
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const validationMessage =
      "Password must be at least 6 characters long and include one uppercase and one lowercase letter.";

    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("New passwords do not match or are empty.");
      return;
    }

    // পাসওয়ার্ড শক্তিমত্তা ভ্যালিডেশন
    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error(validationMessage);
      return;
    }

    // Re-authentication এর জন্য বর্তমান পাসওয়ার্ড আবশ্যক
    if (!currentPassword) {
      toast.error("Please enter your current password for security.");
      return;
    }

    // EmailAuthProvider ব্যবহার করে ক্রেডেনশিয়াল তৈরি করা
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // ১. Re-authenticate: Firebase এ নিরাপত্তার জন্য এই ধাপটি প্রয়োজন
      await reauthenticateWithCredential(user, credential);

      // ২. পাসওয়ার্ড আপডেট
      await updatePassword(user, newPassword);

      toast.success("Password updated successfully! ✅");

      // ফর্ম রিসেট করা
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect current password.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Security requirement: Please log out and log in again, then try updating."
        );
      } else {
        toast.error("Password update failed: " + error.message);
      }
    }
  };

  return (
    <Container className="py-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-base-content">
        👤 Update Your Profile{" "}
      </h2>{" "}
      <div className="max-w-xl mx-auto space-y-8">
        {/* === ১. নাম এবং ছবি আপডেট ফর্ম === */}{" "}
        <div className="card bg-base-200 shadow-xl p-6 border-t-4 border-green-500">
          {" "}
          <h3 className="text-2xl font-semibold mb-4 text-green-600">
            General Information
          </h3>{" "}
          <form onSubmit={handleGeneralUpdate} className="space-y-4">
            {" "}
            <div className="form-control">
              {" "}
              <label className="label">
                <span className="label-text">Display Name</span>{" "}
              </label>{" "}
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className="form-control">
              {" "}
              <label className="label">
                <span className="label-text">Photo URL</span>{" "}
              </label>{" "}
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />{" "}
            </div>{" "}
            <div className="form-control mt-6">
              {" "}
              <button
                type="submit"
                className="btn btn-primary bg-green-600 hover:bg-green-700 border-none text-white"
              >
                Update Details{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>
        {/* --- */} {/* === ২. পাসওয়ার্ড আপডেট ফর্ম === */}{" "}
        <div className="card bg-base-200 shadow-xl p-6 border-t-4 border-red-500">
          {" "}
          <h3 className="text-2xl font-semibold mb-4 text-red-600">
            Change Password
          </h3>{" "}
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {" "}
            {/* Re-authentication এর জন্য বর্তমান পাসওয়ার্ড ইনপুট */}{" "}
            <div className="form-control">
              {" "}
              <label className="label">
                {" "}
                <span className="label-text">
                  Current Password (Required for change)
                </span>{" "}
              </label>{" "}
              <input
                type="password"
                placeholder="Enter current password"
                className="input input-bordered w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className="form-control">
              {" "}
              <label className="label">
                {" "}
                <span className="label-text">
                  New Password (Min 6 characters, uppercase, lowercase)
                </span>{" "}
              </label>{" "}
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className="form-control">
              {" "}
              <label className="label">
                {" "}
                <span className="label-text">Confirm New Password</span>{" "}
              </label>{" "}
              <input
                type="password"
                placeholder="Confirm New Password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className="form-control mt-6">
              {" "}
              <button
                type="submit"
                className="btn btn-error bg-red-600 hover:bg-red-700 border-none text-white"
              >
                Change Password{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </Container>
  );
};

export default ProfileUpdate;
