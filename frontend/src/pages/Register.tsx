import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  CalendarRange,
} from "lucide-react";
import Button from "../components/Button";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { AuthProps } from "../types";

const Register: React.FC<AuthProps> = ({ onToggleAuth }) => {
  const { registerUser, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!username || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const success = await registerUser(username, email, password);
    console.log("Registration success:", success);
    setSubmitting(false);
  };

  const displayError = localError || error;

  return (
    <div className="h-dvh w-dvw flex items-center justify-center p-1.5">
      <div className="bg-card w-full max-w-md rounded-lg p-8 fade-in">
        <div className="flex flex-col items-center text-center mb-5 ">
          <CalendarRange size={42} className="text-primary" />
          <h1 className="text-2xl font-bold mt-2">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get started managing tasks across your team
          </p>
        </div>

        {displayError && (
          <div className="fade-in text-danger bg-danger/10 border border-danger/50 px-2 py-3 rounded-md mb-4 ">
            <span className="text-center">{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <div className="relative items-center flex flex-1">
              <UserIcon size={18} className="absolute left-3" />
              <input
                id="username"
                type="text"
                required
                placeholder="john doe"
                className="border-border border-2 bg-input border w-full rounded-md px-3 py-2 pl-10"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (localError) setLocalError(null);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="email">Email Address</label>
            <div className="relative items-center flex flex-1">
              <Mail size={18} className="absolute left-3" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border-border border-2 bg-input w-full rounded-md px-3 py-2 pl-10"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <div className="relative items-center flex flex-1">
              <Lock size={18} className="absolute left-3" />
              <input
                id="password"
                type="password"
                required
                placeholder="Min 6 characters"
                className="border-border border-2 bg-input w-full rounded-md px-3 py-2 pl-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (localError) setLocalError(null);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative items-center flex flex-1">
              <Lock size={18} className="absolute left-3" />
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Re-enter password"
                className="border-border border-2 bg-input w-full rounded-md px-3 py-2 pl-10"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (localError) setLocalError(null);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-5">
            <UserPlus size={18} />
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground flex mt-5 justify-center gap-1.5">
          <span>Already have an account?</span>
          <Button variant="link" onClick={onToggleAuth}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
