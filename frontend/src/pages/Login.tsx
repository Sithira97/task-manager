import { LogIn, Mail, Lock, CalendarRange } from "lucide-react";
import Button from "../components/Button";
import { useState } from "react";
import type { AuthProps } from "../types";
import { useAuth } from "../context/AuthContext";

const Login: React.FC<AuthProps> = ({ onToggleAuth }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("admin@taskmanager.com");
  const [password, setPassword] = useState("password123");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const success = await login(email, password);
    console.log("Login success:", success);
    setSubmitting(false);
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center p-1.5">
      <div className="bg-card w-full max-w-md rounded-lg p-8 fade-in">
        <div className="flex flex-col items-center text-center mb-5 ">
          <CalendarRange size={42} className="text-primary" />
          <h1 className="text-2xl font-bold mt-2">Sign in to Task Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your details below to access your workspace
          </p>
        </div>

        {error && (
          <div className="fade-in text-danger bg-danger/10 border border-danger/50 px-2 py-3 rounded-md mb-4">
            <span className="text-center">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">Email Address</label>
            <div className="relative items-center flex flex-1">
              <Mail size={18} className="absolute left-3" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border-border bg-input border w-full rounded-md px-3 py-2 pl-10"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <div className="relative items-center flex flex-1">
              <Lock size={18} className="absolute left-3" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="border-input border w-full rounded-md px-3 py-2 pl-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-5">
            <LogIn size={18} />
            {submitting ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground flex mt-5 justify-center gap-1.5">
          <span>New to Task Manager?</span>
          <Button variant="link" onClick={onToggleAuth}>
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
