import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDb";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export const GET = async (
  req: NextRequest,
  // { params }: { params: { orderId: string } }
  props: Props
) => {
  try {
    await connectToDB();

    const { orderId } = await props.params;

    const orderDetails = await Order.findById(orderId).populate({
      path: "products.product",
      model: Product,
    });

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    const customer = await Customer.findOne({
      clerkId: orderDetails.customerClerkId,
    });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (error) {
    console.log("[orderId_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
