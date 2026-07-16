import React from "react";
import type { Team } from "../types";
import { AvatarPopup } from "./Avatar";

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-muted-foreground text-sm shrink-0">
          Team Lead:
        </span>
        {team.team_lead ? (
          <AvatarPopup user={team.team_lead} size="sm" />
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
              <AvatarPopup
                key={member.id || member.username}
                user={member}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
