import { useNavigate } from "react-router-dom";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Success!</h1>
      <p>Your password has been reset, now login with your new password</p>
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
};

export default PasswordResetSuccess;
