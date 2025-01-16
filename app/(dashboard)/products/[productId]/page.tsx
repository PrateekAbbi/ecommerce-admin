"use client";

import React, { useEffect, useState } from "react";

import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";

const ProductDetails = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const [resolvedParams, setResolvedParams] = useState<{
    productId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  useEffect(() => {
    // Resolve the params promise
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  const getProductDetails = async (productId: string) => {
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
    if (resolvedParams) {
      getProductDetails(resolvedParams.productId);
    }
  }, [resolvedParams]);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;

export const dynamic = "force-dynamic";
