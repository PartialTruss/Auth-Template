import { useNavigate } from "react-router-dom";

const PasswordResetFail = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Oh...</h1>
      <p>Something went Wrong!</p>
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
};

export default PasswordResetFail;
