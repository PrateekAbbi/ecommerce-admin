"use client";

import { useEffect, useState } from "react";

import Loader from "@/components/custom ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetails = ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const [resolvedParams, setResolvedParams] = useState<{
    collectionId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  useEffect(() => {
    // Resolve the params promise
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  const getCollectionDetails = async (collectionId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "GET",
      });
      const data = await res.json();
      setCollectionDetails(data);
    } catch (err) {
      console.error("[collectionId_GET]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resolvedParams) {
      getCollectionDetails(resolvedParams.collectionId);
    }
  }, [resolvedParams]);

  return loading ? (
    <Loader />
  ) : (
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetails;
