"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";

const SignUpForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Form submit: Register and trigger verification
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("Account created! Please verify your email.");
      setIsVerifying(true);
    } catch (error) {
      toast.error("Something went wrong, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code submit
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("Email verified! Redirecting...");
      // Redirect somewhere after verification
      router.push("/dashboard");
    } catch {
      toast.error("Verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isResending) return; // prevent spamming
    setIsResending(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(`Verification code resent to ${email}`);
    } catch {
      toast.error("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return isVerifying ? (
    <section className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Verify Your Account</h2>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to <span className="font-medium">{email}</span>.
      </p>

      <form onSubmit={handleVerifyEmail} className="space-y-6">
        <div>
          <Label htmlFor="code" className="text-sm font-medium">
            Verification Code
          </Label>
          <InputOTP
            id="code"
            name="code"
            maxLength={6}
            value={code}
            onChange={setCode}
            className="mt-2"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoaderIcon className="w-5 h-5 animate-spin" /> Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn&apos;t receive it?{" "}
          <Link
            href="#"
            onClick={handleResendCode}
            className={`text-primary font-medium ${isResending ? "opacity-50 pointer-events-none" : "hover:underline"}`}
          >
            {isResending ? "Resending..." : "Resend code"}
          </Link>
        </p>
      </form>
    </section>
  ) : (
    <section className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-8">
      <h2 className="text-3xl font-semibold">Create an Account</h2>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            required
            className="mt-2 focus-visible:ring-2 focus-visible:ring-primary transition"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="mt-2 focus-visible:ring-2 focus-visible:ring-primary transition"
          />
        </div>

        <div className="relative">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            className="mt-2 pr-10 focus-visible:ring-2 focus-visible:ring-primary transition"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-opacity duration-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoaderIcon className="w-5 h-5 animate-spin" /> Creating account...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </section>
  );
};

export default SignUpForm;