import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { convertMongoDBDateToLocalTime } from "../utils/timeUtils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Card className=" my-8 mx-auto max-w-xl">
          <CardHeader >
            <CardTitle className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Your Profile
            </CardTitle>
                </CardHeader>
            <CardContent className=" space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => AuthService.logout()}
                className="mt-2 flex w-full justify-center rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Logout
              </Button>
            </CardFooter>
        </Card>
      )}
    </>
  );
};

export default UserProfilePage;
