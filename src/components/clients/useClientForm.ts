import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClientForm, clientFormSchema } from "@/components/clients/clients";

export type UseClientFormProps = {
  id: string;
};

export const useClientForm = ({ id }: UseClientFormProps) => {
  const tClients = useTranslations("Clients");
  const router = useRouter();

  const [error, setError] = useState("");

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      siren: "",
    },
  });

  const { reset, setError: setFieldError } = form;

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
        siren: d.siren || "",
      });
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
        siren: data.siren?.trim() || undefined,
      };

      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (res.ok) {
        router.push("/clients");
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
          setError(responseData.error || tClients("new.error.createFail"));
        }
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : tClients("new.error.createFail"),
      );
    }
  };

  return { form, onSubmit, error };
};
