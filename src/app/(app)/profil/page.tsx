"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, User2 } from "lucide-react";
import { useProfileLogoUpload } from "@/hooks/useProfileLogoUpload";

export default function ProfilPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { uploading: uploadingLogo, onSelectImage } = useProfileLogoUpload(
    (url) => {
      setLogoUrl(url);
      setSuccess("Logo téléversé");
    },
  );

  const logoPreview = useMemo(() => {
    if (logoFile) {
      return URL.createObjectURL(logoFile);
    }
    if (logoUrl) {
      return logoUrl;
    }
    return "";
  }, [logoFile, logoUrl]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Erreur de chargement (${res.status})`);
        }
        const json = await res.json();
        const p = json?.data;
        if (p && !cancelled) {
          setFullName(p.full_name || "");
          setEmail(p.email || "");
          setPhone(p.phone || "");
          setAddress(p.address || "");
          setLogoUrl(p.logo_url || "");
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Erreur inconnue");
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
  }, []);

  function onLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      onSelectImage(file);
    } else {
      setLogoFile(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          address,
          logo_url: logoUrl,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json.error || `Erreur d'enregistrement (${res.status})`,
        );
      }
      setSuccess("Profil mis à jour");
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Mon profil</h1>

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
          <Label htmlFor="fullName">Nom complet</Label>
          <div className="relative">
            <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName"
              placeholder="Ex: Jean Dupont"
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
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
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
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-9"
              required
              disabled={loading || saving}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="address"
              placeholder="12 rue de Paris, 75000 Paris"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-9"
              required
              disabled={loading || saving}
            />
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <Label htmlFor="logo">Logo sur les factures</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={onLogoChange}
                disabled={loading || saving || uploadingLogo}
              />
            </div>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Aperçu du logo"
                className="h-12 w-12 rounded-full object-cover border"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                Aucune image
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading || saving || uploadingLogo}>
            {saving
              ? "Enregistrement..."
              : uploadingLogo
                ? "Téléversement du logo..."
                : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
