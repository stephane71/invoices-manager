"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewClientPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    const res = await fetch(`/api/clients`, {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      router.push("/clients");
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">New client</h1>
      <div className="grid gap-2">
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
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
        <Button onClick={save} disabled={loading}>
          {loading ? "Saving…" : "Create"}
        </Button>
      </div>
    </div>
  );
}
