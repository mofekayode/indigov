"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "@heroicons/react/24/solid";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { downloadConstituents, getConstituents } from "./helper";

type ConstituentType = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
};

export default function Home() {
  const [authenticationToken, setAuthenticationToken] = useState<string | null>(
    null
  );
  const [constituents, setConstituents] = useState<ConstituentType[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const handleConstituentDownload = async () =>
    await downloadConstituents(authenticationToken);

  useEffect(() => {
    getSession();
    if (authenticationToken) getConsituents();
  }, [authenticationToken]);
  const getSession = async () => {
    const JWT =
      (await supabase.auth.getSession()).data.session?.access_token || null;
    setAuthenticationToken(JWT);
  };
  const getConsituents = async () => {
    setLoading(true);
    const { data, error } = await getConstituents(authenticationToken);
    if (error) {
      console.error(error);
    } else {
      setConstituents(data);
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <p>Fetching Constituents...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 px-8 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          List of Constituents
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleConstituentDownload}>
            Download Constituents
          </Button>

          {/* <Sheet>
              <SheetTrigger>
                <Button
                  variant="outline"
                >
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  Add Constituent
                </Button>
                </SheetTrigger>
            </Sheet> */}
        </div>
      </div>
      {!loading && constituents?.length > 0 && (
        <div>
          <div className="-mt-12 flex justify-center items-center h-screen">
            <div className=" flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <FolderIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                  >
                    <span>Upload a csv file of constituents</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">CSV only</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
