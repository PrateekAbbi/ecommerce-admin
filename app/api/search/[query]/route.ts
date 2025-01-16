import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDb";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    query: string;
  }>;
};

export const GET = async (
  req: NextRequest,
  // { params }: { params: { query: string } }
  props: Props
) => {
  try {
    await connectToDB();
    const { query } = await props.params;

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (error) {
    console.log("[searchQuery_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
