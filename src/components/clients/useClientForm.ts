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
import { useUpdateClient } from "@/hooks/mutations/useUpdateClient";
import { useClient } from "@/hooks/queries/useClient";
import { ApiError } from "@/lib/api-client";
import { APP_PREFIX } from "@/lib/constants";

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

  const { data: client } = useClient(id, {
    enabled: !!id,
  });

  const updateClient = useUpdateClient(id, {
    onSuccess: () => {
      router.push(`/${APP_PREFIX}/clients`);
    },
    onError: (error: Error) => {
      // Handle API errors - check if it's an ApiError with fields
      const apiError = error as ApiError;
      if (apiError.fields) {
        Object.entries(apiError.fields).forEach(([key, message]) => {
          setFieldError(key as keyof ClientForm, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        setError(error.message || tClients("new.error.createFail"));
      }
    },
  });

  useEffect(() => {
    if (client) {
      if (client.client_type === "person") {
        reset({
          client_type: "person",
          firstname: client.firstname || "",
          lastname: client.lastname || "",
          email: client.email || "",
          address: client.address || "",
          phone: client.phone || "",
        });
      } else {
        reset({
          client_type: "company",
          name: client.name || "",
          siren: client.siren || "",
          tva_number: client.tva_number || "",
          email: client.email || "",
          address: client.address || "",
          phone: client.phone || "",
        });
      }
    }
  }, [client, reset]);

  const onSubmit = async (data: ClientForm) => {
    setError("");

    try {
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

      await updateClient.mutateAsync(clientData);
    } catch (e: unknown) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || tClients("new.error.createFail"));
      }
    }
  };

  return { form, onSubmit, error };
};
