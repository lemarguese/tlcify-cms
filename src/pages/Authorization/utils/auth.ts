import { useCallback, useState } from "react";
import type { IUser } from "@/types/user/main.ts";
import { instance } from "@/api/axios.ts";
import { userInitialState } from "@/pages/Settings/utils/settings.tsx";
import { useNavigate } from "react-router";

export const getAuthFunctions = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(userInitialState)

  const fetchMyself = async () => {
    const response = await instance.get('/user/me');
    setUser(response.data);
  }

  const logOut = useCallback(() => {
    localStorage.removeItem('tlcify_access_token');
    navigate('/login');
  }, []);

  return {
    user, fetchMyself, logOut
  }
}
