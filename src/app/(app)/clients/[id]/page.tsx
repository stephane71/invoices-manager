"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch(`/api/clients/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }
      setForm({
        name: d.name || "",
        email: d.email || "",
        address: d.address || "",
        phone: d.phone || "",
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function save() {
    const res = await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/clients");
    }
  }

  async function remove() {
    if (!confirm("Delete this client?")) {
      return;
    }
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/clients");
    }
  }

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Edit client</h1>
      <div className="grid gap-2">
        <label className="text-sm">Name</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Phone</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Address</label>
        <textarea
          className="min-h-20 rounded-md border px-3 py-2 bg-background"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={save}>Save</Button>
        <Button variant="destructive" onClick={remove}>
          Delete
        </Button>
      </div>
    </div>
  );
}
