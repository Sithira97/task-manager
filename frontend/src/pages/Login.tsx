import React, { useState } from "react";
import { LogIn, Mail, Lock, CalendarRange } from "lucide-react";
import type { AuthProps } from "../types";
import { useAuth } from "../context/AuthContext";
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
import { Button } from "@/components/ui/button";

const Login: React.FC<AuthProps> = ({ onToggleAuth }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("admin@taskmanager.com");
  const [password, setPassword] = useState("password123");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const success = await login(email, password);
    console.log("Login success:", success);
    setSubmitting(false);
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md border border-border shadow-md px-4 sm:px-6">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <CalendarRange size={42} className="text-primary" />
          <CardTitle className="text-2xl font-bold mt-2">
            Sign in to Task Manager
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Enter your details below to access your workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="fade-in text-destructive bg-destructive/10 border border-destructive/30 px-3 py-2 rounded-md mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
              <LogIn size={18} />
              {submitting ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground flex justify-center border-t border-border pt-4">
          <span>New to Task Manager?</span>
          <Button
            variant="link"
            onClick={onToggleAuth}
            className="text-primary font-semibold"
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
