"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, signOut } from "@/app/actions/auth";
import { Loader2, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot_password">(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert username to a dummy email for Supabase
      const dummyEmail = `${username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '')}@kutchi.local`;

      if (mode === "register") {
        if (!name.trim()) {
          throw new Error("Name is required");
        }
        if (!username.trim() || username.trim().length < 3) {
          throw new Error("Username must be at least 3 characters");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const res = await signUp(dummyEmail, password, name, username);
        if (res.error) throw new Error(res.error);
        
        // Sign out immediately because Supabase auto-logs in users when email confirmation is disabled
        await signOut();

        setIsSuccess(true);
        setTimeout(() => {
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setIsSuccess(false);
        }, 1500);
      } else {
        const res = await signIn(dummyEmail, password);
        if (res.error) throw new Error(res.error);
        
        setIsSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setTimeout(() => setIsSuccess(false), 500);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-heading text-primary">
            {mode === "login" ? "Welcome Back" : mode === "register" ? "Create an Account" : "Forgot Password?"}
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">
              {mode === "login" ? "Successfully Logged In!" : "Successfully Registered!"}
            </h3>
            <p className="text-sm text-gray-500">Redirecting you...</p>
          </div>
        ) : mode === "forgot_password" ? null : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "register"} 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="your_unique_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <button 
                    type="button" 
                    onClick={() => { setMode("forgot_password"); setError(""); }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={mode === "register"} 
                  minLength={6}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === "login" ? "Login" : "Register")}
            </Button>
          </form>
        )}

        {mode === "forgot_password" && !isSuccess && (
          <div className="space-y-6 mt-4">
            <div className="text-center space-y-4 bg-muted/30 p-6 rounded-xl border">
              <p className="text-sm text-muted-foreground font-medium">
                To reset your password or recover your username, please contact the Admin via WhatsApp.
              </p>
              
              <a 
                href="https://wa.me/919313225740?text=Hello%20Admin,%20I%20forgot%20my%20Kutchi%20Handmade%20username/password.%20Please%20help%20me%20reset%20it."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white h-12 rounded-lg font-bold hover:bg-[#20bd5a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact via WhatsApp
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Number: +91 93132 25740
              </p>
            </div>
            <div className="text-center pt-2">
              <button 
                onClick={() => setMode("login")}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {mode !== "forgot_password" && !isSuccess && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-primary font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
