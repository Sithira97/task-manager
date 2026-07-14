import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  CalendarRange,
} from "lucide-react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-1.5">
      <div className="bg-card w-full max-w-md rounded-lg p-8 fade-in">
        <div className="flex flex-col items-center text-center mb-5 ">
          <CalendarRange size={42} className="text-primary" />
          <h1 className="text-2xl font-bold mt-2">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get started managing tasks across your team
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <div className="relative items-center flex flex-1">
              <UserIcon size={18} className="absolute left-3" />
              <input
                id="username"
                type="text"
                required
                placeholder="john_doe"
                className="border-border border-2 bg-input border w-full rounded-md px-3 py-2 pl-10"
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-5">
            <UserPlus size={18} />
            Register
          </Button>
        </form>

        <div className="text-sm text-muted-foreground flex mt-5 justify-center gap-1.5">
          <span>Already have an account?</span>
          <Link to={"/login"} className="text-primary font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
