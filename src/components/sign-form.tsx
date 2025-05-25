"use client";

import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Optional: for loading spinner

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Schema with name fields
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false); // <-- NEW
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false); // Add this state

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    if (!isLoaded) return;
    setSigningUp(true); // <-- NEW
    setError(null); // <-- NEW
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError(null);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    } finally {
      setSigningUp(false); // <-- NEW
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setVerifying(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.toString(),
      });
      if (
        result.verifications.emailAddress.status === "verified" ||
        result.status === "complete"
      ) {
        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          window.location.href = "/";
          return;
        }
        // Show a success message and sign-in link
        setVerificationSuccess(true);
        setError(null);
      } else {
        setError("Verification failed. Please check the code and try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up for Imaginary Sass</CardDescription>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={signingUp}>
                  {signingUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                {error && (
                  <p className="text-red-500 text-sm text-center max-w-sm">
                    {error}
                  </p>
                )}
              </form>
            </Form>
          ) : verificationSuccess ? (
            // Show this if verification succeeded but no session
            <div className="space-y-4 text-center">
              <div className="text-green-600 font-semibold">
                Verification successful!
              </div>
              <div>
                Please{" "}
                <a href="/sign-in" className="underline text-primary">
                  sign in
                </a>{" "}
                to continue.
              </div>
            </div>
          ) : (
            // ...existing verification form...
            <form onSubmit={onVerify} className="space-y-4">
              <div className="text-center text-sm mb-2">
                Enter the 6-digit code sent to your email.
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                minLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="text-center tracking-widest text-lg"
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifying || code.length !== 6}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-sm text-center max-w-sm">
                  {error}
                </p>
              )}
            </form>
          )}
        </CardContent>

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-medium text-primary underline underline-offset-4"
            >
              Sign in
            </a>
          </p>
          <p className="text-xs">
            By signing up, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
