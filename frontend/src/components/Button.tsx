import type { ButtonHTMLAttributes } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: React.ReactNode;
  className?: string;
  restProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export default function Button({
  variant = "primary",
  children,
  className,
  restProps,
}: ButtonProps) {
  let baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-sm trasition-all cursor-pointer ";
  switch (variant) {
    case "primary":
      baseStyle += "bg-primary text-primary-foreground hover:bg-primary/80";
      break;
    case "secondary":
      baseStyle +=
        "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      break;
    case "outline":
      baseStyle +=
        "border-primary bg-primary/10 text-primary hover:bg-primary/20 border-1";
      break;
    case "ghost":
      baseStyle += "bg-primary text-primary-foreground hover:bg-ghost/80";
      break;
  }

  return (
    <button {...restProps} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
}
