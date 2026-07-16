import React from "react";
import type { User } from "../types";
import { capitalize, cleanCapitalize } from "../utils/words";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-card fade-in flex rounded-lg border-1 border-border p-4 items-center justify-between gap-2 mb-2">
      <div className="flex w-full flex-1 items-center gap-3">
        <div>
          <p className="size-10 bg-primary/50 text-white font-semibold rounded-full flex items-center justify-center">
            {user.username.charAt(0).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-base text-wrap">
            {cleanCapitalize(user.username)}
          </h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="bg-primary/20 text-xs font-semibold text-primary rounded-full px-2 py-1">
        {capitalize(user.role || "user")}
      </div>
    </div>
  );
};

export default UserCard;
