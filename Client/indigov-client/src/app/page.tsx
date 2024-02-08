"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { ArrowUpDown } from "lucide-react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { downloadConstituents, getConstituents } from "./helper";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import AddConstituentForm from "@/components/AddConstituentForm";
import EditConstituentForm from "@/components/EditConstituentForm";

type ConstituentType = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
};

export default function Home() {
  const { toast } = useToast();
  const [authenticationToken, setAuthenticationToken] = useState<string | null>(
    null
  );
  const [constituents, setConstituents] = useState<ConstituentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const supabase = createClientComponentClient();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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

  const ConstituentColumns: ColumnDef<ConstituentType>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Constituent Id</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Date (MM/DD/YY)</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{moment(row.getValue("created_at")).format("MM/DD/YY")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Time (PST)</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{moment(row.getValue("created_at")).format("HH:mm:ss")}</div>
      ),
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>First Name</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Last Name</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Email</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            className="capitalize -ml-4"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Address</p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
      accessorKey: "edit",
      header: "Edit",
      cell: ({ row }) => {
        let data: ConstituentType = {
          id: row.getValue("id"),
          created_at: row.getValue("created_at"),
          first_name: row.getValue("first_name"),
          last_name: row.getValue("last_name"),
          email: row.getValue("email"),
          address: row.getValue("address"),
        };
        return (
          <div>
            <EditConstituentForm
              data={data}
              cb={getConsituents}
              authenticationToken={authenticationToken}
            />
          </div>
        );
      },
    },
  ];
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = e.target.files && e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${BASE_URL}/csv/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authenticationToken}`,
        },
        body: formData,
      });
      console.log({ response });
      const responseBody = await response.text();
      if (response.ok) {
        toast({
          description: responseBody,
        });
        getConsituents();
        setUploading(false);
      } else {
        toast({
          description: responseBody,
          variant: "destructive",
        });
        setUploading(false);
      }
    } else {
      toast({
        description: "Select a CSV file to upload",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  if (loading && !uploading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <p>Fetching Constituents...</p>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <p>Uploading Constituents </p>
          <p>This might take some time...</p>
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
          <div>
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md p-3 bg-gray-100"
            >
              <span className="text-black dark:text-black">Upload Constituents</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <Sheet
            open={addOpen}
            onOpenChange={() => {
              setAddOpen((curr) => !curr);
            }}
          >
            <SheetTrigger>
              <Button variant="outline">
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add Constituent
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add constituents</SheetTitle>
              </SheetHeader>
              <AddConstituentForm
                setOpen={setAddOpen}
                cb={getConsituents}
                authenticationToken={authenticationToken}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {!loading && constituents?.length === 0 && (
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
                      accept=".csv"
                      onChange={handleFileUpload}
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
      <div className="mt-10">
        {constituents ? (
          <DataTable
            data={constituents}
            columns={ConstituentColumns}
            filterVariable={"first_name"}
          />
        ) : (
          <Skeleton className="w-full h-[600px]" />
        )}
      </div>
    </main>
  );
}
