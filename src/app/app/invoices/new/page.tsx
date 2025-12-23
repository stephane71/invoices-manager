"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "@/components/clients/ClientFieldGroup";
import { ClientForm } from "@/components/clients/clients";
import { ArticleFieldGroup } from "@/components/invoices/ArticleFieldGroup";
import ClientBlock from "@/components/invoices/ClientBlock";
import { InvoiceFieldGroup } from "@/components/invoices/InvoiceFieldGroup";
import { PaymentFieldGroup } from "@/components/invoices/PaymentFieldGroup";
import { Iban } from "@/components/invoices/iban/Iban";
import {
  INVOICE_ITEM_EMPTY,
  InvoiceForm,
  invoiceFormSchema,
  InvoiceItem,
} from "@/components/invoices/invoices";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useCreateInvoice } from "@/hooks/mutations/useCreateInvoice";
import { useClients } from "@/hooks/queries/useClients";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProfile } from "@/hooks/queries/useProfile";
import {
  ClientCreationError,
  useCreateNewClientFromNewInvoice,
} from "@/hooks/useCreateNewClientFromNewInvoice";
import { useMinDelay } from "@/hooks/useMinDelay";
import { ApiError } from "@/lib/api-client";
import { APP_LOCALE, APP_PREFIX } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";

const ERROR_DEFAULT = "";
const FIELD_ERROR_DEFAULT = undefined;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [error, setError] = useState(ERROR_DEFAULT);
  const [clientFieldErrors, setClientFieldErrors] = useState<
    FieldErrors | typeof FIELD_ERROR_DEFAULT
  >();
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      number: "",
      clientId: "",
      issueDate: todayISO(),
      items: [INVOICE_ITEM_EMPTY],
      operationType: "services",
      vatExemptionMention: "",
      paymentIban: "",
      paymentBic: "",
      paymentLink: "",
      paymentFreeText: "",
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const clientId = watch("clientId");
  const items = watch("items");
  const iban = watch("paymentIban");
  const bic = watch("paymentBic");

  // Fetch data using React Query
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const loading = clientsLoading || productsLoading || profileLoading;

  useEffect(() => {
    if (profile) {
      setValue("paymentIban", profile.payment_iban || "");
      setValue("paymentBic", profile.payment_bic || "");
    }
  }, [profile, setValue]);

  const totalAmount = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.total) || 0), 0),
    [items],
  );

  /* CLIENT */

  const handleSelectClient = (id: string) => {
    setValue("clientId", id, { shouldValidate: true });
  };

  const createClientFromSelection = useCreateNewClientFromNewInvoice();
  const { pending: clientBlockLoading, wrap } = useMinDelay(2000);

  const onRequestCreateNewClient = async (clientData: ClientForm) => {
    try {
      setClientFieldErrors(FIELD_ERROR_DEFAULT);
      setError(ERROR_DEFAULT);

      const newId = await wrap(() => createClientFromSelection(clientData));
      setValue("clientId", newId, { shouldValidate: true });
    } catch (e: unknown) {
      if (e instanceof ClientCreationError) {
        if (e.fieldErrors) {
          setClientFieldErrors(e.fieldErrors);
        } else {
          setError(e.message);
        }
      } else {
        setError(
          e instanceof Error ? e.message : t("new.error.clientCreateFail"),
        );
      }
    }
  };

  /* ARTICLES */

  function addItem() {
    setValue("items", [...items, INVOICE_ITEM_EMPTY], { shouldValidate: true });
  }

  function removeItem(index: number) {
    setValue(
      "items",
      items.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  function updateItem(index: number, updatedItem: InvoiceItem) {
    const next = [...items];
    next[index] = updatedItem;
    setValue("items", next, { shouldValidate: true });
  }

  /* INVOICE SUBMIT */

  const createInvoice = useCreateInvoice({
    onSuccess: () => {
      router.push(`/${APP_PREFIX}/invoices`);
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      if (
        apiError.status === 409 ||
        /duplicate|exists|unique/i.test(String(apiError.message))
      ) {
        setError(t("new.error.duplicateNumber"));
      } else {
        setError(apiError.message || t("new.error.createFail"));
      }
    },
  });

  const onSubmit = async (data: InvoiceForm) => {
    setError(ERROR_DEFAULT);

    try {
      await createInvoice.mutateAsync({
        number: data.number.trim(),
        client_id: data.clientId,
        items: data.items,
        total_amount: +totalAmount.toFixed(2),
        issue_date: data.issueDate,
        status: "draft",
        operation_type: data.operationType,
        vat_exemption_mention: data.vatExemptionMention?.trim() || null,
        payment_iban: data.paymentIban?.trim() || null,
        payment_bic: data.paymentBic?.trim() || null,
        payment_link: data.paymentLink?.trim() || null,
        payment_free_text: data.paymentFreeText?.trim() || null,
      });
    } catch (e: unknown) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || t("new.error.createFail"));
      }
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="pb-28">
        <h1 className="mb-4 text-xl font-semibold">{t("new.title")}</h1>

        <InvoiceFieldGroup control={control} />

        <div>
          <div className="text-muted-foreground mt-8 mb-2 text-sm font-semibold tracking-wide uppercase">
            {t("new.client")}
          </div>

          <ClientBlock
            clients={clients}
            clientId={clientId}
            onSelectClientAction={handleSelectClient}
            onRequestCreateNewClientAction={onRequestCreateNewClient}
            isLoading={clientBlockLoading}
            clientFormErrors={clientFieldErrors}
          />
          {errors.clientId && (
            <FieldError>
              {errors.clientId?.message ? t(errors.clientId.message) : ""}
            </FieldError>
          )}
        </div>

        <div>
          <div className="text-muted-foreground mt-8 mb-2 text-sm font-semibold tracking-wide uppercase">
            {t("new.items")}
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              {items.map((item, idx) => (
                <ArticleFieldGroup
                  key={idx}
                  item={item}
                  products={products}
                  onChange={(updatedItem) => updateItem(idx, updatedItem)}
                  onRemove={() => removeItem(idx)}
                />
              ))}
            </div>

            <div className="flex items-center justify-end">
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={addItem}
              >
                {t("new.addItem")}
              </Button>
            </div>
          </div>

          {errors.items && (
            <FieldError>
              {errors.items?.message ? t(errors.items.message) : ""}
            </FieldError>
          )}
        </div>

        <div>
          <div className="text-muted-foreground mt-8 mb-2 text-sm font-semibold tracking-wide uppercase">
            {t("new.payment.title")}
          </div>

          <div className="flex flex-col gap-4">
            <Iban
              iban={iban}
              bic={bic}
              onChange={(data) => {
                setValue("paymentIban", data.paymentIban);
                setValue("paymentBic", data.paymentBic);
              }}
              onDelete={() => {
                setValue("paymentIban", "");
                setValue("paymentBic", "");
              }}
            />

            <PaymentFieldGroup control={control} disabled={isSubmitting} />
          </div>
        </div>
      </div>

      <div className="bg-background fixed inset-x-0 bottom-0 z-10 border-t p-3">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex flex-col items-end justify-between gap-2 px-2">
          <div className="text-lg font-medium">
            {t("new.total")}{" "}
            {centsToCurrencyString(totalAmount, "EUR", APP_LOCALE)}{" "}
            {c("vatExcluded")}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/app/invoices")}
              disabled={isSubmitting}
            >
              {c("cancel")}
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? c("saving") : t("new.create")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
