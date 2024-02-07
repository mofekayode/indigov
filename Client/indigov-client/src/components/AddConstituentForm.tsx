import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

type AddConstituentProps = {
  setOpen: (isOpen: boolean) => void;
  cb: () => void;
  authenticationToken: string | null;
};

function AddConstituentForm({
  setOpen,
  cb,
  authenticationToken,
}: AddConstituentProps) {
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      fetch(`${BASE_URL}/constituent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticationToken}`,
        },
        body: JSON.stringify({
          first_name: e.currentTarget.FirstName.value,
          last_name: e.currentTarget.LastName.value,
          email: e.currentTarget.Email.value,
          address: e.currentTarget.Address.value,
        }),
      });
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
    toast({
      description: "New Constituent Added",
    });
    setOpen(false);
    cb();
  };

  return (
    <form className="mt-10 h-full mb-20 relative" onSubmit={handleFormSubmit}>
      <div className="mt-4">
        <Label htmlFor="First Name">First Name</Label>
        <Input
          type="text"
          id="First Name"
          name="FirstName"
          placeholder="e.g Mofe"
          required={true}
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="Last Name">First Name</Label>
        <Input
          type="text"
          id="Last Name"
          name="LastName"
          placeholder="e.g Kayode"
          required={true}
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="First Name">Email</Label>
        <Input
          type="email"
          id="Email"
          name="Email"
          placeholder="e.g Mofekayode@gmail.com"
          required={true}
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="Last Name">Address</Label>
        <Input
          type="Address"
          id="Address"
          name="Address"
          placeholder="e.g 1188 marina blvd"
        />
      </div>

      <div className="flex justify-center mt-36">
        <Button type="submit">Add Constituent</Button>
      </div>
    </form>
  );
}

export default AddConstituentForm;
