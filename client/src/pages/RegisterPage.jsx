import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { SignupForm } from "@/forms/SignupForm";
import Header from "@/components/common/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RegisterPage = () => {
  // Adding state for email, password, and confirmPassword
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/console");
    }
  }, [currentUser, navigate]);


  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="h-5/6 flex flex-col justify-center">
        <Card className="max-w-2xl md:mx-auto md:w-1/2 my-2 sm:my-8 mx-2 sm:mx-4 border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold leading-8 text-cyan-700/70 sm:text-4xl sm:leading-10 ">Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <SignupForm />
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">Or continue with</span>
              </div>
            </div> */}
            <div className="flex items-center justify-center dark:bg-gray-800 mt-4">
              <button 
              onClick={AuthService.signInWithGoogle}
              className="  px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                <span className="font-roboto">Sign up with Google</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
