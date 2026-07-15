import { LogIn, Mail, Lock, CalendarRange } from "lucide-react";
import Button from "../components/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("admin@taskmanager.com");
  const [password, setPassword] = useState("password123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
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
                  if (error) setError(null);
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
                  if (error) setError(null);
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
          <Link to={"/register"} className="text-primary font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
