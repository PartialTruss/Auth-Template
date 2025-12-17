import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";

const ForgotPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  const navigate = useNavigate();

  const onSubmitClicked = async () => {
    try {
      await api.put(`/auth/api/forgot-password/${emailValue}`);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.message);
      }
    }
  };

  return success ? (
    <div className="">
      <h1>success!</h1>
    </div>
  ) : (
    <div className="">
      <h1>Forgot Password</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <input
        type="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <button disabled={!emailValue} onClick={onSubmitClicked}></button>
    </div>
  );
};

export default ForgotPasswordPage;
