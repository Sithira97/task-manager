import type { Task, TeamUser } from "@/types";
import { filterValidTasks } from "@/lib/tasks";
import { cleanCapitalize, getInitials } from "@/lib/words";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCardExtraSmall } from "@/components/TaskCard";

interface UserCardProps {
  user?: TeamUser;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserCardProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;
  const Lead = filterValidTasks(user.tasks.lead);
  const Collab = filterValidTasks(user.tasks.collaborate);

  const totalTasksCount = Lead.length + Collab.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="px-4 xs:px-5 sm:px-6">
        <DialogHeader className="flex flex-col xs:flex-row items-center justify-between gap-4 xs:pr-6 xs:pl-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              size="lg"
              className="ring-2 ring-primary/10 group-hover/card:ring-primary/20 transition-all"
            >
              <AvatarFallback
                className={`bg-gradient-to-br ${getGradientClass(user.username)} font-bold text-white text-base`}
              >
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <DialogTitle className="font-bold text-base text-foreground truncate flex items-center gap-1.5">
                {cleanCapitalize(user.username)}
              </DialogTitle>
              {user.email && (
                <DialogDescription className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                  <Mail className="size-3 text-muted-foreground/60 shrink-0" />
                  {user.email}
                </DialogDescription>
              )}
            </div>
          </div>
          <div className="shrink-0">
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
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
              <List className="size-4 mb-1 text-muted-foreground/80" />
              <span className="text-xs font-medium text-foreground">
                {totalTasksCount}
              </span>
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
              <Briefcase className="size-4 mb-1 text-muted-foreground/80" />
              <span className="text-xs font-medium text-foreground">
                {Lead.length}
              </span>
              <span className="text-[10px] text-muted-foreground">Leading</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center bg-muted/40 border-border/60 text-muted-foreground">
              <Users className="size-4 mb-1 text-muted-foreground/80" />
              <span className="text-xs font-medium text-foreground">
                {Collab.length}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Collaborating
              </span>
            </div>
          </div>

          {/* Collapsible Task Section */}
          {totalTasksCount > 0 && (
            <div className="border-t border-border/50 pt-3 mt-1 flex flex-col">
              <Tabs defaultValue="lead" className="flex flex-col max-h-[300px]">
                <TabsList className="w-full">
                  <TabsTrigger value="lead" className="w-full">
                    Leading ({Lead.length})
                  </TabsTrigger>
                  <TabsTrigger value="collab" className="w-full">
                    Collaborating ({Collab.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="lead"
                  className="overflow-y-auto p-1 xs:p-2 space-y-2 scrollbar"
                >
                  {Lead.length > 0 ? (
                    Lead.map((task: Task) => (
                      <TaskCardExtraSmall key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                      <span className="text-[11px]">
                        No active tasks in this category
                      </span>
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="collab"
                  className="overflow-y-auto xs:p-2 space-y-2 scrollbar"
                >
                  {Collab.length > 0 ? (
                    Collab.map((task: Task) => (
                      <TaskCardExtraSmall key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                      <span className="text-[11px]">
                        No active tasks in this category
                      </span>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
