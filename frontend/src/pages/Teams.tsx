import { useEffect, useState } from "react";
import type { User } from "../types";
import UserCard from "../components/UserCard";

const Teams: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/users");
      const data = await response.json();
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      }
      console.log(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-5">
      <h1 className="font-bold text-xl text-primary mb-4">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
};

export default Teams;
