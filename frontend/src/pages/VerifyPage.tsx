import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyPage = () => {
  const [message, setMessage] = useState("Verifying...");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("No token provided.");
      return;
    }

    axios
      .get(`http://localhost:3000/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage(res.data.message);

        // Optional: redirect to login after 3 seconds
        if (res.data.message.includes("success")) {
          setTimeout(() => navigate("/login"), 3000);
        }
      })
      .catch((err) => {
        // Show backend message if available
        const msg =
          err.response?.data?.message || "Verification failed. Try again.";
        setMessage(msg);
      });
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyPage;
