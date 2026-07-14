import type { ButtonHTMLAttributes } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  children,
  className,
  ...restProps
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
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
      baseStyle +=
        "bg-transparent text-primary hover:text-primary/80 border-none";
      break;
    case "link":
      baseStyle +=
        "bg-transparent text-primary !p-0 hover:text-primary/80 hover:underline border-none";
      break;
  }

  return (
    <button {...restProps} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
}
