import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import { useUser } from "../hooks/useUser";

const UserInfoPage: React.FC = () => {
  const user = useUser();
  const { email } = user;
  const navigate = useNavigate();

  const [token, setToken] = useToken();

  if (!user) return <div>Loading...</div>;

  // const saveChanges = async () => {
  //   try {
  //     const response = await axios.put(
  //       `/api/users/${id}`,
  //       {
  //         email,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const { token: newToken } = response.data;
  //     setToken(newToken);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       return;
  //     }
  //   }
  // };

  const logOut = () => {
    setToken(undefined);
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">User Info Page</h1>
      <p>Email: {user.email}</p>
      <button onClick={logOut}>logout</button>
    </div>
  );
};

export default UserInfoPage;
