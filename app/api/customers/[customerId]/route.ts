import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDb";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    customerId: string;
  }>;
};

export const GET = async (
  req: NextRequest,
  // { params }: { params: { customerId: string } }
  props: Props
) => {
  try {
    await connectToDB();

    const { customerId } = await props.params;

    const orders = await Order.find({
      customerClerkId: customerId,
    }).populate({ path: "products.product", model: Product });

    return NextResponse.json(orders, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.log("[customerId_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
