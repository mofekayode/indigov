import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserNav from "./UserNav";
import { ModeToggle } from "./ModeToggle";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/Login");
    }
  };
  return (
    <div className="h-16 flex px-4 items-center justify-between border-b  sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center">
        <Link href="/" className="text-4xl font-bold tracking-tight mr-8">
          Indigov
        </Link>
      </div>
      <div className="flex items-center">
        <ModeToggle />
        <div className="ml-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
