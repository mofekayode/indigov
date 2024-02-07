"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UserAuthForm() {
  const [view, setView] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let router = useRouter();

  const handleSubmit = async () => {
    setError(false);
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(true);
    }
    if (!error) {
      router.push("/");
    }
  };
  return (
    <div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="jullies@indigov.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="mt-4 relative">
        <Label htmlFor="Password">Password</Label>
        <Input
          type={view ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="Password"
        />
        <div className="absolute right-3 bottom-2">
          {view ? (
            <EyeSlashIcon className="w-6 h-6" onClick={() => setView(false)} />
          ) : (
            <EyeIcon className="w-6 h-6" onClick={() => setView(true)} />
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-sm text-center">
          You entered the wrong credentials
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <Button className="px-10" onClick={handleSubmit}>
          Login
        </Button>
      </div>
    </div>
  );
}
