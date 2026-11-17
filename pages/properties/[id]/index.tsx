import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyListSkeleton } from "@/components/properties/PropertyListSkeleton";
import { getProperty } from "@/services/propertyService";
import { PROPERTY_TYPE_LABELS, type Property } from "@/types/property";

type LoadState = "loading" | "error" | "not-found" | "ready";

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  const [property, setProperty] = useState<Property | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setState("loading");
    try {
      const data = await getProperty(id);
      setProperty(data);
      setState("ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load property";
      if (message === "Property not found") {
        setState("not-found");
      } else {
        setErrorMessage(message);
        setState("error");
      }
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Head>
        <title>{property ? `${property.name} — BYOB` : "Property — BYOB"}</title>
      </Head>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All properties
        </Link>

        <div className="mt-6">
          {state === "loading" && <PropertyListSkeleton />}

          {state === "not-found" && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                This property doesn&apos;t exist or may have been removed.
              </p>
              <Button asChild className="mt-4">
                <Link href="/">Back to properties</Link>
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Button variant="outline" className="mt-4" onClick={load}>
                Retry
              </Button>
            </div>
          )}

          {state === "ready" && property && (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {property.name}
                </h1>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-secondary-foreground">
                  {PROPERTY_TYPE_LABELS[property.propertyType]}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {property.address ?? "No address on file"}
              </p>
              {property.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {property.notes}
                </p>
              )}

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href={`/properties/${property.id}/home-manager`}>
                  <Card className="h-full transition-colors hover:border-foreground/30">
                    <CardHeader>
                      <CardTitle>Home Manager</CardTitle>
                      <CardDescription>
                        Appliances, warranties, insurance and inspections for
                        this property.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href={`/properties/${property.id}/projects`}>
                  <Card className="h-full transition-colors hover:border-foreground/30">
                    <CardHeader>
                      <CardTitle>DIY Projects</CardTitle>
                      <CardDescription>
                        Plan and track improvement projects for this
                        property.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
