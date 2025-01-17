import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/mongoDb";
import Product from "@/lib/models/Product";

type Props = {
  params: Promise<{
    collectionId: string
  }>
}

export const GET = async (
  req: NextRequest,
  // { params }: { params: { collectionId: string } }
  props: Props
) => {
  try {
    await connectToDB();

    const { collectionId } = await props.params;
    const collection = await Collection.findById(collectionId).populate({
      path: "products",
      model: Product,
    });

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  // { params }: { params: { collectionId: string } }
  props: Props
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { collectionId } = await props.params;
    let collection = await Collection.findById(collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    collection = await Collection.findByIdAndUpdate(
      collectionId,
      { title, description, image },
      { new: true }
    );

    await collection.save();

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  // { params }: { params: { collectionId: string } }
  props: Props
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { collectionId } = await props.params;
    await Collection.findByIdAndDelete(collectionId);

    await Product.updateMany(
      { collections: collectionId },
      {
        $pull: { collections: collectionId },
      }
    );

    return new NextResponse("Collection deleted", { status: 200 });
  } catch (error) {
    console.log("[collectionsID_DELETE]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";