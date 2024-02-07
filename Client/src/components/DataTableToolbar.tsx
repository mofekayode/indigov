"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterVariable: string;
}

export function DataTableToolbar<TData>({
  table,
  filterVariable,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [variable,setVariable] = useState("first_name");
  const filters =[ {key:"first_name",value:'First Name'},{key:"last_name",value:'Last Name'},{key:"email",value:'Email'},{key:"address",value:'Address'}]
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`filter by ${variable}`}
          value={
            (table.getColumn(variable)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(variable)?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
              <Select
                value={variable}
                onValueChange={(e: string) => {
                 setVariable(e);
                }}
              >
                <SelectTrigger className="w-[230px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filter</SelectLabel>

                    {filters?.map((filter) => (
                      <SelectItem key={filter.key} value={filter.key || ""}>
                        <p className="cursor-pointer">{filter.value}</p>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
      </div>

    </div>
  );
}
