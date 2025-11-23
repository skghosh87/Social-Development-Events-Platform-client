import React, { useContext, useState } => "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Container from "../Components/Container";
import { auth } from """; // <-- আপনার Firebase Auth ইনস্ট্যান্সের সঠিক পাথ দিন

const ProfileUpdate = () => {
  const { user, loading, setUser } = useContext(AuthContext); // setUser ফাংশনটি AuthContext থেকে আসা ধরে নেওয়া হচ্ছে
  
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

  // যদি user না থাকে, তাহলে রিডাইরেক্ট করে দিতে পারেন, যদিও এটি Protected Route এর মধ্যে থাকার কথা।
  if (!user) {
    return <p className="text-center py-20 text-red-500">Please log in to update your profile.</p>;
  }

  // নাম এবং ছবি আপডেটের হ্যান্ডলার
  const handleGeneralUpdate = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // UI রিফ্রেশ করার জন্য AuthContext এর user স্টেট আপডেট করুন
      setUser({ ...user, displayName, photoURL });
      
      toast.success("Profile details updated successfully!");
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  // পাসওয়ার্ড আপডেটের হ্যান্ডলার
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match or are empty.");
      return;
    }
    if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
    }
    
    // Firebase পাসওয়ার্ড আপডেটের জন্য প্রায়শই Re-authentication প্রয়োজন হয়
    if (!currentPassword) {
        toast.error("Please enter your current password for security.");
        return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
        // ১. Re-authenticate
        await reauthenticateWithCredential(user, credential);

        // ২. পাসওয়ার্ড আপডেট
        await updatePassword(user, newPassword);

        toast.success("Password updated successfully! Please re-login soon.");
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            toast.error("Incorrect current password.");
        } else if (error.code === 'auth/requires-recent-login') {
            toast.error("Security requirement: Please log out and log in again, then try updating.");
        } else {
            toast.error("Password update failed: " + error.message);
        }
    }
  };


  return (
    <Container className="py-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-base-content">
        👤 Update Your Profile
      </h2>
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* === ১. নাম এবং ছবি আপডেট ফর্ম === */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 text-green-600">General Information</h3>
          <form onSubmit={handleGeneralUpdate} className="space-y-4">
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
            
            <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                    Update Details
                </button>
            </div>
          </form>
        </div>

        {/* --- */}

        {/* === ২. পাসওয়ার্ড আপডেট ফর্ম === */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 text-red-600">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            
            {/* Re-authentication এর জন্য বর্তমান পাসওয়ার্ড ইনপুট */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password (Required for change)</span>
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                className="input input-bordered w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password (Min 6 characters)</span>
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-6">
                <button type="submit" className="btn btn-error">
                    Change Password
                </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default ProfileUpdate;