import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import main_logo from "../assets/Images/Group 1.svg";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import Input from "../components/common/Input";
import { useToken } from "../context/useToken";
import { useUser } from "../hooks/useUser";
import { api } from "../lib/axios";

const LoginPage: React.FC = () => {
  const [, setToken] = useToken();
  const user = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load Google OAuth URL
  useEffect(() => {
    const loadGoogleUrl = async () => {
      try {
        const res = await api.get("/auth/api/google/url");
        setGoogleUrl(res.data.url);
      } catch (err) {
        console.error(err);
      }
    };

    loadGoogleUrl();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/api/login", {
        email,
        password,
      });

      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (user) return null;

  return (
    <main className="flex justify-evenly items-center bg-[#EDF6F9]/18 w-full">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form className="flex flex-col w-full mt-5">
          <h2 className="text-[2.37rem] font-myfont text-[#006D77]">
            Hey , Welcome Back !
          </h2>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <section className="flex justify-between items-center mb-4">
            <Checkbox />
            <Link to="/forgot-password" className="text-sm text-[#00363A]">
              Forgot password?
            </Link>
          </section>
          <Button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            text={loading ? "Logging in..." : "Log In"}
          />
          <section className="flex justify-between items-center mt-3">
            <div className="border h-0 border-e rotate-y-180 flex justify-center w-[45%] border-[#83C5BE]/30"></div>
            <p>or</p>
            <div className="border h-0 border-e rotate-y-180 flex justify-center w-[45%] border-[#83C5BE]/30"></div>
          </section>
          <button
            disabled={!googleUrl}
            onClick={() => (window.location.href = googleUrl)}
            className="border px-4 py-3 w-full max-w-sm mt-5 border-[#006D77] rounded-lg"
          >
            <p className="text-[#006D77]">Sign in with Google</p>
          </button>
        </form>
        <p className="mt-2">
          <span className="text-[#00363A]/25">New member?</span>
          <span className="text-[#00363A]"> Create an account</span>
        </p>
      </div>
      <div className="h-screen bg-[#00363A]/25 w-0.5"></div>
      <div className="">
        <img src={main_logo} alt="" className="h-112 self-center" />
      </div>
    </main>
  );
};

export default LoginPage;
