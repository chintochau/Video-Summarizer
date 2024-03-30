import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { getUserDataByEmail } from "../services/UserService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userData = await getUserDataByEmail({ email: user.email });
        setUserData(userData);
        setCredits(parseFloat(userData.credits).toFixed(1));
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
    userId: userData._id,
    setCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
