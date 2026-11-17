import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyListSkeleton } from "@/components/properties/PropertyListSkeleton";
import { getProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";

type LoadState = "loading" | "error" | "ready";

export function PropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await getProperties();
      setProperties(data);
      setState("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load properties",
      );
      setState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Your properties
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every property you&apos;re tracking in BYOB.
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">New property</Link>
        </Button>
      </div>

      <div className="mt-8">
        {state === "loading" && <PropertyListSkeleton />}

        {state === "error" && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button variant="outline" className="mt-4" onClick={load}>
              Retry
            </Button>
          </div>
        )}

        {state === "ready" && properties.length === 0 && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No properties yet. Add your first one to get started.
            </p>
            <Button asChild className="mt-4">
              <Link href="/properties/new">New property</Link>
            </Button>
          </div>
        )}

        {state === "ready" && properties.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
