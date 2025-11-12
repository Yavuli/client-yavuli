import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the email sign-in logic here.
    // This includes generating a secure, one-time sign-in link and sending it to the user's email.
    // For demonstration purposes, we'll just simulate the email sending process.
    if (email) {
      console.log(`Sending sign-in link to ${email}`)
      setIsEmailSent(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <Link to="/" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Certified Sign-In</h1>
          <p className="text-muted-foreground">
            {isEmailSent
              ? "A sign-in link has been sent to your email."
              : "Enter your email to receive a secure sign-in link."
            }
          </p>
        </div>
        {!isEmailSent ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Sign-In Link
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p>Please check your inbox and follow the link to sign in securely.</p>
            <p className="text-sm text-muted-foreground mt-4">
              The link is valid for 15 minutes.
            </p>
          </div>
        )}
        <div className="text-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-6">
          <p>After sign-in completion, any previous unverified sessions will be invalidated to prevent unauthorized access.</p>
          <p>We use HTTPS to ensure your sign-in link is delivered securely.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
