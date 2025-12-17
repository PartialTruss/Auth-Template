import { AxiosError } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/axios";
import PasswordResetFail from "./PasswordResetFail";
import PasswordResetSuccess from "./PasswordResetSuccess";

const PasswordResetPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const { passwordResetCode } = useParams();

  const onResetClicked = async () => {
    try {
      await api.put(`/auth/api/users/${passwordResetCode}/forgot-password`, {
        newPassword: passwordValue,
      });
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsFailure(true);
        console.log(error);
        
      }
    }
  };

  if (isFailure) return <PasswordResetFail />;
  if (isSuccess) return <PasswordResetSuccess />;

  return (
    <div>
      <h1>Reset Password</h1>
      <p>Please enter a new password</p>

      <input
        type="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        placeholder="Password"
      />
      <input
        type="password"
        value={confirmPasswordValue}
        onChange={(e) => setConfirmPasswordValue(e.target.value)}
        placeholder="Confirm Password"
      />
      <button
        disabled={
          !passwordValue ||
          !confirmPasswordValue ||
          passwordValue !== confirmPasswordValue
        }
        onClick={onResetClicked}
      >
        Reset Password
      </button>
    </div>
  );
};

export default PasswordResetPage;
