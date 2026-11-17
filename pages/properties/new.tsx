import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyInputSchema } from "@/lib/validation/property";
import { createProperty } from "@/services/propertyService";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  type PropertyType,
} from "@/types/property";

interface FormState {
  name: string;
  propertyType: PropertyType | "";
  address: string;
  notes: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  propertyType: "",
  address: "",
  notes: "",
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const parsed = propertyInputSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      await createProperty(parsed.data);
      router.push("/");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create property",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>New property — BYOB</title>
      </Head>
      <div className="mx-auto max-w-xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>New property</CardTitle>
            <CardDescription>
              Add a property to start tracking its appliances, warranties and
              projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={
                    fieldErrors.name ? "name-error" : undefined
                  }
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-sm text-destructive">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Type</Label>
                <Select
                  value={form.propertyType}
                  onValueChange={(value) =>
                    setForm((f) => ({
                      ...f,
                      propertyType: value as PropertyType,
                    }))
                  }
                >
                  <SelectTrigger
                    id="propertyType"
                    aria-invalid={Boolean(fieldErrors.propertyType)}
                    aria-describedby={
                      fieldErrors.propertyType
                        ? "propertyType-error"
                        : undefined
                    }
                  >
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {PROPERTY_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.propertyType && (
                  <p
                    id="propertyType-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.propertyType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  aria-invalid={Boolean(fieldErrors.address)}
                  aria-describedby={
                    fieldErrors.address ? "address-error" : undefined
                  }
                />
                {fieldErrors.address && (
                  <p id="address-error" className="text-sm text-destructive">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  aria-invalid={Boolean(fieldErrors.notes)}
                  aria-describedby={
                    fieldErrors.notes ? "notes-error" : undefined
                  }
                />
                {fieldErrors.notes && (
                  <p id="notes-error" className="text-sm text-destructive">
                    {fieldErrors.notes}
                  </p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save property"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
