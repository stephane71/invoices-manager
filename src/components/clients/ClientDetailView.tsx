import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClientFieldGroup } from "@/components/clients/ClientFieldGroup";
import { ClientForm, clientFormSchema } from "@/components/clients/clients";
import { Button } from "@/components/ui/button";

export const ClientDetailView = ({
  id,
  onClose,
}: {
  id: string;
  onClose?: () => void;
}) => {
  const router = useRouter();

  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    let active = true;
    fetch(`/api/clients/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }
      reset({
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
  }, [id, reset]);

  const onSubmit = async (data: ClientForm) => {
    setError("");

    try {
      const clientData = {
        name: data.name.trim(),
        email: data.email.trim() || undefined,
        phone: data.phone.trim() || undefined,
        address: data.address.trim() || undefined,
      };

      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (res.ok) {
        if (onClose) {
          onClose();
        } else {
          router.push("/clients");
        }
        router.refresh();
      } else {
        const responseData = await res.json();

        if (responseData.fields) {
          Object.entries(responseData.fields).forEach(([key, message]) => {
            setFieldError(key as keyof ClientForm, {
              type: "server",
              message: message as string,
            });
          });
        } else {
          setError(responseData.error || t("new.error.createFail"));
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("new.error.createFail"));
    }
  };

  const remove = async () => {
    if (!confirm(t("confirm.delete"))) {
      return;
    }
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (onClose) {
        onClose();
      } else {
        router.push("/clients");
      }
      router.refresh();
    }
  };

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClientFieldGroup control={control} disabled={isSubmitting}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? c("saving") : c("save")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={remove}
            disabled={isSubmitting}
          >
            {c("delete")}
          </Button>
        </ClientFieldGroup>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
};
