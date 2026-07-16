import React from "react";
import type { User } from "../types";
import { capitalize, cleanCapitalize } from "../lib/words";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const initials = user.username.charAt(0).toUpperCase();

  return (
    <Card className="bg-card fade-in border border-border shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/20 font-bold text-primary text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-base text-foreground truncate">
              {cleanCapitalize(user.username)}
            </h3>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <span className="shrink-0 bg-primary/15 text-xs font-semibold text-primary rounded-full px-2.5 py-1">
          {capitalize(user.role || "user")}
        </span>
      </CardContent>
    </Card>
  );
};

export default UserCard;
