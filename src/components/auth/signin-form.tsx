"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake loading delay for demo purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-10 flex flex-col gap-8 bg-background rounded-2xl shadow-xl">
      <div className="space-y-2 text-left">
        <h2 className="text-3xl font-bold tracking-tight">🚪 Sign in to <span className="text-primary">Faria</span></h2>
        <p className="text-muted-foreground text-sm">Welcome back! Please enter your credentials to continue.</p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-6 w-full">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-10 focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoaderIcon className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in with email"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignInForm;