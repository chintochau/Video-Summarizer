import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { SignupForm } from "@/forms/SignupForm";
import Header from "@/components/common/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RegisterPage = () => {
  // Adding state for email, password, and confirmPassword

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="h-5/6 flex flex-col justify-center">
        <Card className="max-w-2xl md:mx-auto md:w-1/2 my-2 sm:my-8 mx-2 sm:mx-4">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
