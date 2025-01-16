import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDb";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export const GET = async (
  // { params }: { params: { productId: string } }
  props: Props
) => {
  try {
    await connectToDB();

    const { productId } = await props.params;

    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections } },
      ],
      _id: { $ne: product._id },
    });

    if (!relatedProducts) {
      return new NextResponse(
        JSON.stringify({ message: "No related product found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (error) {
    console.log("[related_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";