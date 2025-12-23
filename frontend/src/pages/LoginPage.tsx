import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // 🔹 Redirect if already logged in
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

  // 🔹 Prevent blank screen during hydration
  if (user === undefined) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full max-w-sm rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full max-w-sm rounded"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-sm disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <button
        disabled={!googleUrl}
        onClick={() => (window.location.href = googleUrl)}
        className="border px-4 py-2 rounded w-full max-w-sm mt-3"
      >
        Continue with Google
      </button>

      <div className="mt-3">
        <Link to="/forgot-password" className="text-sm text-blue-600">
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
