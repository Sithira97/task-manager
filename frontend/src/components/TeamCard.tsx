import React from "react";
import type { Team } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarGroup } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cleanCapitalize, getInitials } from "@/lib/words";

interface UserCardProps {
  team: Team;
}

const TeamCard: React.FC<UserCardProps> = ({ team }) => {
  const teamMembers = team.team_members?.filter(
    (member) => member.username !== team.team_lead?.username,
  );

  return (
    <Card className="bg-card fade-in flex flex-col border border-border shadow-sm">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-muted-foreground text-sm shrink-0">
            Team Lead:
          </span>
          {team.team_lead ? (
            <Tooltip key={team.team_lead.id || team.team_lead.username}>
              <TooltipTrigger>
                <Avatar>
                  <AvatarFallback>
                    {getInitials(team.team_lead.username)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {cleanCapitalize(team.team_lead.username)}
              </TooltipContent>
            </Tooltip>
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
              <AvatarGroup>
                {teamMembers.map((member) => (
                  <Tooltip key={member.id || member.username}>
                    <TooltipTrigger>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      {cleanCapitalize(member.username)}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </div>
          </div>
        )}
      </CardContent>
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
    </Card>
  );
};

export default TeamCard;
