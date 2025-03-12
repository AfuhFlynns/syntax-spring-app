"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Github, Twitter } from "lucide-react";
import Logo from "@/components/logo";
import PasswordStrengthCriteria from "@/components/password-strength-criteria";
import PasswordStrengthMeter from "@/components/password-strength-meter";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your API to sign up the user
    // For demo purposes, we'll just show a success message
    toast({
      title: "Account created",
      description: "Please check your email to verify your account.",
    });
    router.push("/auth/verify-email");
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="w-full h-auto flex flex-row items-center justify-center mt-8">
            <Logo />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your email below to create your account and start coding
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              {formData.password.trim() !== "" && (
                <PasswordStrengthMeter password={formData.password} />
              )}
              {formData.password.trim() !== "" && (
                <PasswordStrengthCriteria password={formData.password} />
              )}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" className="w-full">
                <Github className="mr-2 h-4 w-4" /> Github
              </Button>
              <Button variant="secondary" className="w-full">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/log-in"
                className="text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
