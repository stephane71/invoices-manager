import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CLIENT_FORM_PERSON_DEFAULT,
  ClientForm,
  clientFormSchema,
} from "@/components/clients/clients";

export type UseClientFormProps = {
  id: string;
};

export const useClientForm = ({ id }: UseClientFormProps) => {
  const tClients = useTranslations("Clients");
  const router = useRouter();

  const [error, setError] = useState("");

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: CLIENT_FORM_PERSON_DEFAULT,
  });

  const { reset, setError: setFieldError } = form;

  useEffect(() => {
    let active = true;

    fetch(`/api/clients/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }

      if (d.client_type === "person") {
        reset({
          client_type: "person",
          firstname: d.firstname || "",
          lastname: d.lastname || "",
          email: d.email || "",
          address: d.address || "",
          phone: d.phone || "",
        });
      } else {
        reset({
          client_type: "company",
          name: d.name || "",
          siren: d.siren || "",
          tva_number: d.tva_number || "",
          email: d.email || "",
          address: d.address || "",
          phone: d.phone || "",
        });
      }
    });

    return () => {
      active = false;
    };
  }, [id, reset]);

  const onSubmit = async (data: ClientForm) => {
    setError("");

    try {
      // Build client data based on client type
      const clientData =
        data.client_type === "person"
          ? {
              client_type: "person" as const,
              firstname: data.firstname.trim(),
              lastname: data.lastname.trim(),
              email: data.email.trim() || undefined,
              phone: data.phone.trim() || undefined,
              address: data.address.trim() || undefined,
            }
          : {
              client_type: "company" as const,
              name: data.name.trim(),
              siren: data.siren.trim(),
              tva_number: data.tva_number?.trim() || undefined,
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
        router.push("/app/clients");
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
