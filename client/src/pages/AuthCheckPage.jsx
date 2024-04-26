import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/AuthService";
import React, { useEffect } from "react";

const AuthCheckPage = () => {
  // This code runs inside of an iframe in the extension's offscreen document.
  // This gives you a reference to the parent frame, i.e. the offscreen document.
  // You will need this to assign the targetOrigin for postMessage.
  const PARENT_FRAME = document.location.ancestorOrigins[0];

  function sendResponse(result) {
    globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME);
  }

  const checkAuth = async () => {
    const user = await AuthService.checkAuth();
    if (user) {
      sendResponse({ success: true, email: user.email});
    } else {
      const user = await AuthService.signInWithGoogle();
      sendResponse({ success: true, user });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return <div>Checking Autentication...</div>;
};

export default AuthCheckPage;
