import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import { api } from "../lib/axios";

const SignupPage: React.FC = () => {
  const [token, setToken] = useToken();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const onLogInClicked = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<{ token: string }>("/auth/api/sign-up", {
        email: emailValue,
        password: passwordValue,
      });

      const { token } = response.data;
      setToken(token);
      navigateTo("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
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

export default SignupPage;
