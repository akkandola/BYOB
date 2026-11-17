import Link from "next/link";
import { useEffect, useState } from "react";
import { getProperty } from "@/services/propertyService";

export function ComingSoonFeature({
  propertyId,
  title,
  description,
}: {
  propertyId: string;
  title: string;
  description: string;
}) {
  const [propertyName, setPropertyName] = useState<string | null>(null);

  useEffect(() => {
    getProperty(propertyId)
      .then((property) => setPropertyName(property.name))
      .catch(() => setPropertyName(null));
  }, [propertyId]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/properties/${propertyId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to property
      </Link>

      <div className="mt-10 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {title}
          {propertyName ? ` for ${propertyName}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {description} This is coming soon.
        </p>
      </div>
    </div>
  );
}
