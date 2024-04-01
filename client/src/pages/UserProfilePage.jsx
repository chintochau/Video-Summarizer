import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { convertMongoDBDateToLocalTime } from "../utils/timeUtils";

const UserProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
        navigate("/login");
    }
  });

  const renderTier = () => {
    switch (userData.tier) {
      case "tier-professional":
        return (
          <label
            htmlFor="fullname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Tier
            <div>{userData.tier}</div>
            <div>{convertMongoDBDateToLocalTime(userData.expirationDate)}</div>
          </label>
        );
        break;
      default: // free
        return (
          <label
            htmlFor="fullname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Tier
            <div>{userData.tier}</div>
          </label>
        );

        break;
    }
  };

  return (
    <>
      {currentUser && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Your Profile
            </h2>
            <div className=" space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div>{currentUser.email}</div>
              </div>
              <div>{renderTier()}</div>
            </div>
            <div>
              <button
                onClick={() => AuthService.logout()}
                className="mt-2 flex w-full justify-center rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
