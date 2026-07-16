import React, { useState, useRef, useEffect } from "react";
import type { User } from "../types";
import { cleanCapitalize, capitalize, getInitials } from "../utils/words";
import { Mail, Shield } from "lucide-react";

interface AvatarProps {
  user: User;
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = "md", onClick }) => {
  const initials = getInitials(user.username);
  const displayName = cleanCapitalize(user.username);

  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} bg-secondary hover:bg-secondary text-secondary-foreground font-semibold rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none ring-1 ring-card hover:ring-accent/50 group`}
      title={`View ${displayName}'s profile`}
      aria-haspopup="true"
    >
      {initials}

      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-neutral-100 text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
        {displayName}
      </span>
    </button>
  );
};

export const AvatarPopup: React.FC<AvatarProps> = ({ user, size = "md" }) => {
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user.username);
  const displayName = cleanCapitalize(user.username);
  const email = user.email || "No email provided";
  const role = user.role || "user";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none hover:z-10 transition-all"
    >
      <Avatar
        user={user}
        size={size}
        onClick={() => setShowPopup(!showPopup)}
      />

      {showPopup && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card text-card-foreground border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-t-xl relative w-full opacity-80 h-[48px] bg-secondary" />
          <div className="px-4 pb-4 pt-0 relative flex flex-col items-center">
            <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full border-4 border-card flex items-center justify-center font-bold text-xl -mt-8 shadow-md">
              {initials}
            </div>

            <h4 className="mt-3 font-bold text-base text-center leading-tight">
              {displayName}
            </h4>

            <span
              className={`mt-1.5 px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1
              ${role === "admin" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-primary/10 text-primary"}
            `}
            >
              <Shield size={12} />
              {capitalize(role)}
            </span>

            <div className="w-full border-t border-border mt-4 pt-3 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={14} className="shrink-0" />
                <span className="truncate" title={email}>
                  {email}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
