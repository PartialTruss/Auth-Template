import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/useToken";

const OauthSuccess = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token); // store JWT in localStorage or context
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return <p className="text-center mt-10">Signing you in…</p>;
};

export default OauthSuccess;
