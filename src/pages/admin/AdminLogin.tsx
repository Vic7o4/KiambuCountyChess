import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, LogIn } from "lucide-react";
import logo from "@/assets/kcca-logo-enhanced.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isAuthorizedAdminEmail } from "@/lib/adminAccess";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast.error("Invalid credentials. Please try again.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const loggedInEmail = userData.user?.email;

    if (!isAuthorizedAdminEmail(loggedInEmail)) {
      await supabase.auth.signOut();
      toast.error("Unauthorized access. Only approved KCCA committee accounts can access the admin dashboard.");
      return;
    }

    toast.success("Welcome back!");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="KCCA Logo" className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-primary shadow-lg" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to manage KCCA
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg border border-border p-8 space-y-5">
          {searchParams.get("unauthorized") === "1" && (
            <p className="text-sm text-destructive">
              Access denied. Your account is not approved for admin use.
            </p>
          )}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-1.5">
              <Mail className="h-4 w-4 text-muted-foreground" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kcca.co.ke"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="flex items-center gap-2 mb-1.5">
              <Lock className="h-4 w-4 text-muted-foreground" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <>{isLoading ? "Signing in..." : <><LogIn className="h-4 w-4 mr-2" /> Sign In</>}</>
          </Button>
          <button
            type="button"
            onClick={async () => {
              if (!email) {
                toast.error("Please enter your email address first");
                return;
              }
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
              if (error) {
                toast.error(error.message);
              } else {
                toast.success("Password reset link sent! Check your email.");
              }
            }}
            className="block mx-auto text-sm text-secondary font-semibold hover:underline"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
