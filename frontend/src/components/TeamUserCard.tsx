import type { TeamUser } from "@/types";
import { filterValidTasks } from "@/lib/tasks";
import { cleanCapitalize, getInitials } from "@/lib/words";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Crown,
  User as UserIcon,
  Mail,
  Briefcase,
  Users,
  List,
} from "lucide-react";
import { getGradientClass } from "@/lib/colors";

interface UserCardProps {
  user: TeamUser;
  setModalView?: React.Dispatch<
    React.SetStateAction<{ open: boolean; userId: number }>
  >;
}

const TeamUserCard: React.FC<UserCardProps> = ({ user, setModalView }) => {
  const Lead = filterValidTasks(user.tasks.lead);
  const Collab = filterValidTasks(user.tasks.collaborate);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() =>
          setModalView &&
          user.id !== undefined &&
          setModalView({ open: true, userId: user.id })
        }
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            size="lg"
            className="ring-2 ring-primary/10 group-hover/card:ring-primary/20 transition-all"
          >
            <AvatarFallback
              className={`bg-gradient-to-br ${getGradientClass(user.name)} font-bold text-white text-base`}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <CardTitle className="font-bold text-base text-foreground truncate flex items-center gap-1.5">
              {cleanCapitalize(user.name)}
            </CardTitle>
            {user.email && (
              <CardDescription className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                <Mail className="size-3 text-muted-foreground/60 shrink-0" />
                {user.email}
              </CardDescription>
            )}
          </div>
        </div>
        <CardAction className="shrink-0">
          {user.role === "admin" ? (
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full px-2.5 py-1 ring-1 ring-amber-500/20">
              <Crown className="size-3" />
              Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary dark:text-primary-foreground/90 text-xs font-semibold rounded-full px-2.5 py-1 ring-1 ring-primary/20">
              <UserIcon className="size-3" />
              User
            </span>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center justify-around p-2 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <List className="size-4 text-muted-foreground/80" />
              <span className="text-xs text-muted-foreground truncate">
                Total
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {Lead.length + Collab.length}
            </span>
          </div>

          <div className="flex items-center justify-around p-2 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <Briefcase className="size-4 text-muted-foreground/80" />
              <span className="text-xs text-muted-foreground truncate">
                Led by
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {Lead.length}
            </span>
          </div>

          <div className="flex items-center justify-around p-2 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <Users className="size-4 text-muted-foreground/80" />
              <span className="text-xs text-muted-foreground truncate">
                Collaborate
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {Collab.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamUserCard;
