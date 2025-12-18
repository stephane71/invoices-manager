# InvoEase Project Guidelines

## Coding Standards

### Function Declarations
- **Always use arrow functions** for all function declarations
- Apply this rule to:
  - Component definitions
  - Event handlers
  - Utility functions
  - API route handlers
  - Callbacks

**Example:**
```typescript
// ✅ Correct
export const MyComponent = () => {
  return <div>Hello</div>;
};

const handleClick = () => {
  console.log("clicked");
};

// ❌ Avoid
export default function MyComponent() {
  return <div>Hello</div>;
}

function handleClick() {
  console.log("clicked");
}
```

### Form Components Pattern

When creating a new form, follow this structure:

1. **Create a dedicated FieldGroup component** named `<FormName>FieldGroup`
   - Example: `ClientFieldGroup`, `InvoiceFieldGroup`, `ProductFieldGroup`

2. **Component structure:**
   - Accept `control` from React Hook Form
   - Accept optional `disabled` prop
   - Accept optional `children` prop for action buttons
   - Use React Hook Form `Controller` components
   - Wrap fields in Shadcn UI `Field`, `FieldLabel`, `FieldError` components
   - Return fields wrapped in `FieldGroup` component

3. **When implementing the FieldGroup component:**
   - **Must be wrapped in a `<form>` tag**
   - The form tag should include `onSubmit={handleSubmit(onSubmit)}`
   - Pass action buttons as children to the FieldGroup component

**Example Pattern:**

```typescript
// 1. Create the FieldGroup component (e.g., ClientFieldGroup.tsx)
export const ClientFieldGroup = ({
  control,
  disabled = false,
  children,
}: ClientFormProps) => {
  const t = useTranslations("Clients");

  return (
    <FieldGroup>
      <Controller
        name="fieldName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
};

// 2. Implement with form tag wrapper
const MyFormPage = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    // Handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ClientFieldGroup control={form.control} disabled={form.formState.isSubmitting}>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </ClientFieldGroup>
    </form>
  );
};
```

## Technology Stack

- **Frontend:** Next.js with App Router
- **Forms:** React Hook Form with Zod validation
- **UI Components:** Shadcn UI
- **Internationalization:** next-intl
- **Styling:** Tailwind CSS

## Reference Implementation

See `/src/components/clients/ClientFieldGroup.tsx` and `/src/app/app/clients/new/page.tsx` for reference implementation of the form pattern.