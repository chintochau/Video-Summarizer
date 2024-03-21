import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import {
  createUserAccountByEmail,
  getUserDataByEmail,
} from "../services/UserService";
import { useNavigate } from "react-router-dom";
import SummaryService from "../services/SummaryService";

const UserProfilePage = () => {
  const { currentUser, userId } = useAuth();
  const navigate = useNavigate()
  const [summaries, setSummaries] = useState([])

  if (!currentUser) {
    navigate('/login')
  }

  const getUserInfo = () => {
    if (currentUser && currentUser.email) {
      getUserDataByEmail({ email: currentUser.email });
    }
  };

  const createUserAccount = () => {
    createUserAccountByEmail({ email: currentUser.email });
  };


  useEffect(() => {
    async function fetchSummaries() {
      const summaries = await SummaryService.getAllSummariesForUser(userId);
      console.log(summaries);
      setSummaries(summaries.data)
    }
    fetchSummaries();
  }, [])


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Your Profile
          </h2>
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div>{currentUser.email}</div>

          </div>
          <div>
            <button
              onClick={() => AuthService.logout()}
              className="mt-2 flex w-full justify-center rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Logout
            </button>

            <div className="text-lg"> Summary History
              {summaries.map((summary) => (<div key={summary._id}>
                <div>{summary.sourceTitle}</div></div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
