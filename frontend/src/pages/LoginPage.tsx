import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import { useUser } from "../hooks/useUser";

const LoginPage: React.FC = () => {
  const [token, setToken] = useToken();
  const user = useUser();
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogInClicked = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ token: string }>("/api/login", {
        email: emailValue,
        password: passwordValue,
      });

      setToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Redirect after token/user is updated
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Redirect if already logged in
  if (user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        className="border p-2 mb-2 w-full max-w-sm rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        className="border p-2 mb-4 w-full max-w-sm rounded"
      />
      <button
        onClick={onLogInClicked}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </div>
  );
};

export default LoginPage;
