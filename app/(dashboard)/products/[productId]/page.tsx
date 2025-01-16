"use client";

import React, { useEffect, useState } from "react";

import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const getProductDetails = async () => {
    const { productId } = await params;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "GET" });

      const data = await res.json();
      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("[productId_GET]", error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;

export const dynamic = "force-dynamic";
