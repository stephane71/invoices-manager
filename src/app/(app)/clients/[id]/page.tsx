"use client";

import { use } from "react";
import { ClientDetailView } from "@/components/clients/ClientDetailView";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ClientDetailView id={id} />;
}
