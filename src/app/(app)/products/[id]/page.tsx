"use client";

import { use } from "react";
import { ProductDetailView } from "@/components/products/ProductDetailView";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ProductDetailView id={id} />;
}
