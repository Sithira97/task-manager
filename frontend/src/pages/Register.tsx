import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  CalendarRange,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import type { AuthProps } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const Register: React.FC<AuthProps> = ({ onToggleAuth }) => {
  const { registerUser, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!username || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    await registerUser(username, email, password);
    setSubmitting(false);
  };

  const displayError = localError || error;

  return (
    <div className="h-dvh w-dvw flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md border border-border shadow-md">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <CalendarRange size={42} className="text-primary" />
          <CardTitle className="text-2xl font-bold mt-2">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Get started managing tasks across your team
          </CardDescription>
        </CardHeader>

        <CardContent>
          {displayError && (
            <div className="fade-in text-destructive bg-destructive/10 border border-destructive/30 px-3 py-2 rounded-md mb-4 text-sm text-center">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon className="px-3">
                  <UserIcon size={18} />
                </InputGroupAddon>
                <InputGroupInput
                  id="username"
                  type="text"
                  required
                  placeholder="john doe"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (localError) setLocalError(null);
                    if (error) clearError();
                  }}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon className="px-3">
                  <Mail size={18} />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (localError) setLocalError(null);
                    if (error) clearError();
                  }}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon className="px-3">
                  <Lock size={18} />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                    if (error) clearError();
                  }}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon className="px-3">
                  <Lock size={18} />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (localError) setLocalError(null);
                    if (error) clearError();
                  }}
                />
              </InputGroup>
            </Field>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 h-10"
            >
              <UserPlus size={18} />
              {submitting ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground flex justify-center gap-1.5 border-t border-border pt-4">
          <span>Already have an account?</span>
          <Button
            variant="link"
            onClick={onToggleAuth}
            className="text-primary font-semibold"
          >
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
