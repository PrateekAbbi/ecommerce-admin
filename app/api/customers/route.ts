import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDb";

import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();

    const customers = await Customer.find().sort({ createdAt: "desc" });

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.log("[customers_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
