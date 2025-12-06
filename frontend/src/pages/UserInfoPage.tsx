import { useUser } from "../hooks/useUser";

const UserInfoPage: React.FC = () => {
  const user = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">User Info Page</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInfoPage;
