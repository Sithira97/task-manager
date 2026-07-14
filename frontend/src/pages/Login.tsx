import { LogIn, Mail, Lock, CalendarRange } from "lucide-react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-1.5">
      <div className="bg-card w-full max-w-md rounded-lg p-8 fade-in">
        <div className="flex flex-col items-center text-center mb-5 ">
          <CalendarRange size={42} className="text-primary" />
          <h1 className="text-2xl font-bold mt-2">Sign in to Task Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your details below to access your workspace
          </p>
        </div>

        <form>
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-5">
            <LogIn size={18} />
            Sign In
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
