import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from './ui/use-toast';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

type ConstituentType = {
    id: string;
    created_at: string;
    email: string;
    first_name: string;
    last_name: string;
    address: string;
  };

type EditConstituentProps = {
  data:ConstituentType  
  cb: () => void;
  authenticationToken: string|null;
};

  
function EditConstituentForm({data,cb,authenticationToken}:EditConstituentProps) {
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
     await fetch(`${BASE_URL}/constituent/${data.id}`, {
        method: "PATCH",
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
        variant:"destructive"
      });
    }
    toast({
      description: "Constituent Edited",
    });
    setEditOpen(false);
    cb()
  }

  const handleDeleteConstituent = async () => {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
       await fetch(`${BASE_URL}/constituent/${data.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authenticationToken}`,
            },
            });
            toast({
                description: "Constituent Deleted",
            });
            setEditOpen(false);
            cb()
    } catch (error: any) {
        toast({
            description: error.message,
            variant:"destructive"
        });
    }
 
    }


  return (
    <Sheet  
      open={editOpen}
      onOpenChange={() => {
        setEditOpen((curr) => !curr);
      }}>
        <SheetTrigger>
           <Button className="relative h-8 w-14">Edit</Button>  
          </SheetTrigger>
          <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit constituents</SheetTitle>
          </SheetHeader>
          <form className='mt-10 h-full mb-20 relative' onSubmit={handleFormSubmit}>
        <div className='mt-4'>
          <Label htmlFor="First Name">First Name</Label>
          <Input
            type="text"
            id="First Name"
            name="FirstName"
            placeholder="e.g Mofe"
            defaultValue={data.first_name}
            required={true}
          />
        </div>
        <div className='mt-4'>
          <Label htmlFor="Last Name">First Name</Label>
          <Input
            type="text"
            id="Last Name"
            name="LastName"
            placeholder="e.g Kayode"
            defaultValue={data.last_name}
            required={true}
          />
        </div>
        <div className='mt-4'>
          <Label htmlFor="First Name">Email</Label>
          <Input
            type="email"
            id="Email"
            name="Email"
            placeholder="e.g Mofekayode@gmail.com"
            defaultValue={data.email}
            required={true}
          />
        </div>
        <div className='mt-4'>
          <Label htmlFor="Last Name">Address</Label>
          <Input
            type="Address"
            id="Address"
            name="Address"
            defaultValue={data.address}
            placeholder="e.g 1188 marina blvd"
          />
        </div>

      <div className="flex justify-between mt-36">
        <Button type="submit">Edit Constituent</Button>
        <Button className='bg-red-600 hover:bg-red-700' onClick={handleDeleteConstituent}>Delete Constituent</Button>
      </div>
    </form>
        </SheetContent>
      </Sheet>
  )
}

export default EditConstituentForm