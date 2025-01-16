"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

import { useEffect, useState } from "react";

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const getCustomers = async () => {
    try {
      const res = await fetch(`/api/customers`);
      const data = await res.json();
      console.log(data);
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.log("[customers_GET]", error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Customers</p>
      <Separator className="bg-grey-1 my-5" />
      <DataTable columns={columns} data={customers} searchKey="name" />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Customers;
