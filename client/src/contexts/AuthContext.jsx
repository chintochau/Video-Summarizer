import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { getUserDataByEmail } from "../services/UserService";
import { getItem, setItem } from "@/services/LocalStorageService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getItem("currentUser") || null)
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [credits, setCredits] = useState(null);
  const [userId, setUserId] = useState(null)

  const clearUserData = () => {
    setUserData({})
    setUserId(null)
    setCredits(null)
  }

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (user) => {
      setCurrentUser(user);
      setItem("currentUser", user);
      if (user) {
        const userData = await getUserDataByEmail({ email: user.email });
        setUserData(userData);
        setCredits(parseFloat(userData.credits).toFixed(1));
        setUserId(userData._id)
      } else {
        clearUserData()
      }
      setLoading(false);
    });

    return unsubscribe; // Invoke this on component unmount
  }, []);

  const value = {
    currentUser,
    loading,
    userData,
    credits,
    userId,
    setCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
