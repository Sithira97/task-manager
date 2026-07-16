import React from "react";
import type { Team } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar } from "./ui/avatar";

interface UserCardProps {
  team: Team;
}

const TeamCard: React.FC<UserCardProps> = ({ team }) => {
  const teamMembers = team.team_members?.filter(
    (member) => member.username !== team.team_lead?.username,
  );

  return (
    <Card className="bg-card fade-in flex flex-col border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-bold text-base text-wrap">
          {team.title}
        </CardTitle>
        {team.description && (
          <CardDescription className="text-xs text-muted-foreground line-clamp-1">
            {team.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-muted-foreground text-sm shrink-0">
            Team Lead:
          </span>
          {team.team_lead ? (
            <Avatar size="sm" />
          ) : (
            <span className="font-semibold text-sm">Unknown</span>
          )}
        </div>

        {teamMembers && teamMembers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-muted-foreground text-sm shrink-0">
              Team members:
            </span>
            <div className="flex -space-x-2 items-center overflow-visible">
              {teamMembers.map((member) => (
                <Avatar key={member.id || member.username} size="sm" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCard;
