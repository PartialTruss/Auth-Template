import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Status = "verifying" | "success" | "error";

const VerifyPage = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const controller = new AbortController();

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3000/auth/verify-email?token=${token}`,
          { signal: controller.signal }
        );

        setStatus("success");
        setStatus(res.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (controller.signal.aborted) return;

          setStatus("error");
          setStatus(
            err.response?.data?.message || "Verification failed. Try again."
          );
        }
      }
    };

    verifyEmail();

    return () => {
      controller.abort();
    };
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Email Verification</h1>

      {status === "verifying" && <p>⏳ Please wait...</p>}
      {status === "success" && <p>✅ Redirecting to login...</p>}
      {status === "error" && <p>❌ Something went wrong</p>}
    </div>
  );
};

export default VerifyPage;
