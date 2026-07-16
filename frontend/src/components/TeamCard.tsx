import React from "react";
import type { Team } from "../types";
import { cleanCapitalize } from "../utils/words";
import { User } from "lucide-react";

interface UserCardProps {
  team: Team;
}

const TeamCard: React.FC<UserCardProps> = ({ team }) => {
  const teamMembers = team.team_members?.filter(
    (member) => member.username !== team.team_lead?.username,
  );

  return (
    <div className="bg-card fade-in flex flex-col rounded-lg border-1 border-border p-4 gap-2 mb-2">
      <div className="flex flex-col">
        <h3 className="font-bold text-base text-wrap">{team.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {team.description}
        </p>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <User size={14} className="" />
        <span className="text-muted-foreground text-sm">Team Lead:</span>
        <span className="font-semibold">
          {cleanCapitalize(team.team_lead?.username) || "Unknown"}
        </span>
      </div>

      {teamMembers && teamMembers.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User size={14} className="" />
          <span className="text-muted-foreground text-sm">Team members:</span>
          <span className="font-semibold">
            {teamMembers
              ?.map((member) => cleanCapitalize(member.username))
              .join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
