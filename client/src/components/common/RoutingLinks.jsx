import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/utils";
import { Link } from "react-router-dom";

export const LinkToDashboard = ({ children, className }) => {

  const {currentUser} = useAuth();

  return (
    <Link
      to={currentUser ? "/console/youtube" : "summarizer"}
      className={cn(className)}
    >
      {children}
    </Link>
  );
};


export const LinkToPricing = ({ children, className }) => {
  return (
    <Link to="/pricing" className={cn(className)}>
      {children}
    </Link>
  );
}