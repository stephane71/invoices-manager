"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function ProfilPage() {
  const t = useTranslations("Profile");
  const c = useTranslations("Common");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(t("error.load", { status: res.status }));
        }
        const json = await res.json();
        const p = json?.data;
        if (p && !cancelled) {
          setFullName(p.full_name || "");
          setEmail(p.email || "");
          setPhone(p.phone || "");
          setAddress(p.address || "");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t("error.unknown"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const handlePhoneBlur = () => {
    const phoneValue = phone.trim();
    if (phoneValue && !isValidPhoneNumber(phoneValue)) {
      setPhoneError(
        t("error.invalidPhone", {
          default: "Invalid phone number format. Use international format (e.g., +33612345678)",
        })
      );
    } else {
      setPhoneError(null);
    }
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate phone before submitting
    const phoneValue = phone.trim();
    if (phoneValue && !isValidPhoneNumber(phoneValue)) {
      setPhoneError(
        t("error.invalidPhone", {
          default: "Invalid phone number format. Use international format (e.g., +33612345678)",
        })
      );
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          address,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: null }));
        throw new Error(json.error || t("error.save", { status: res.status }));
      }
      setSuccess(t("status.updated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error.unknown"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600" role="status">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">{t("form.fullName")}</Label>
          <div className="relative">
            <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName"
              placeholder={t("form.fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9"
              required
              disabled={loading || saving}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("form.email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder={t("form.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
              disabled={loading || saving}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="phone"
              type="tel"
              placeholder={t("form.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={handlePhoneBlur}
              className={`pl-9 ${phoneError ? "border-red-500" : ""}`}
              required
              disabled={loading || saving}
            />
          </div>
          {phoneError && (
            <p className="text-xs text-red-600">{phoneError}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">{t("form.address")}</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="address"
              placeholder={t("form.addressPlaceholder")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-9"
              required
              disabled={loading || saving}
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading || saving}>
            {saving ? c("saving") : c("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
