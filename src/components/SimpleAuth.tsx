"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  LocalUser,
} from "@/lib/local-storage";
import { toast } from "sonner";
import Image from "next/image";

/**
 * The SimpleAuth component provides lightweight local authentication using browser storage.
 * It allows users to log in with just a name and email, storing their data in localStorage
 * for quick session persistence. Logged-in users see a personalized greeting, avatar, and
 * logout option. When not logged in, a simple login form or button is displayed. The
 * component can manage its own visibility or be controlled externally through props.
 */

type Props = {
  showLogin?: boolean;
  setShowLogin?: (v: boolean) => void;
};

export function SimpleAuth(props: Props) {
  const { showLogin: externalShow, setShowLogin: externalSet } = props;

  const [internalShow, setInternalShow] = useState(false);
  const showLogin = externalShow ?? internalShow;
  const setShowLogin = externalSet ?? setInternalShow;

  const [user, setUser] = useState<LocalUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      const stored = getStoredUser();
      if (stored) setUser(stored);
      setMounted(true);
    });
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    const newUser: LocalUser = {
      id: Date.now().toString(),
      name,
      email,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name
      )}`,
      createdAt: new Date().toISOString(),
    };

    setStoredUser(newUser);
    setUser(newUser);
    setShowLogin(false);
    toast.success(`Welcome, ${name}!`);
  };

  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  if (!mounted) {
    return <div className="w-16 h-8 rounded bg-gray-100 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm hidden sm:inline">Welcome, {user.name}</span>
        <Image
          src={user.image}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    );
  }

  if (showLogin) {
    return (
      <form onSubmit={handleLogin} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-32"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-40"
        />
        <Button type="submit" size="sm">
          Login
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLogin(false)}
        >
          Cancel
        </Button>
      </form>
    );
  }

  return (
    <Button onClick={() => setShowLogin(true)} size="sm">
      Login
    </Button>
  );
}
