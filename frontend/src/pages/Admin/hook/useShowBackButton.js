// hooks/useShowBackButton.js
import { useLocation } from "react-router-dom";

export default function useShowBackButton() {
  const location = useLocation();

  // Muncul jika sedang di halaman admin yang bukan dashboard
  return location.pathname.startsWith("/admin") &&
         location.pathname !== "/admin" &&
         location.pathname !== "/admin/dashboard";
}
