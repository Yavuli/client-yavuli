
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Join Yavuli</h1>
          <p className="text-muted-foreground mt-2">Create your student marketplace account</p>
        </div>

        <div className="text-center bg-accent/50 border border-accent p-3 rounded-lg">
          <p className="text-sm font-semibold text-accent-foreground">Access is limited to verified college email IDs (.edu, .ac.in, .college)</p>
        </div>

        <Button variant="outline" className="w-full py-3 text-base">
          <FcGoogle className="mr-3 text-2xl" />
          Continue with Google
        </Button>

        <div className="flex items-center justify-center space-x-4">
          <hr className="w-full border-border" />
          <span className="text-muted-foreground text-sm">OR</span>
          <hr className="w-full border-border" />
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" type="text" placeholder="Rahul Sharma" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college-email">College Email</Label>
            <Input id="college-email" type="email" placeholder="rahul@iitdelhi.ac.in" />
            <p className="text-xs text-muted-foreground">Must be a valid .edu, .ac.in, or .college email</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" placeholder="Delhi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input id="college" type="text" placeholder="IIT Delhi" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Signup;
