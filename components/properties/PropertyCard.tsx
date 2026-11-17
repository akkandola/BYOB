import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROPERTY_TYPE_LABELS, type Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="transition-colors hover:border-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{property.name}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-secondary-foreground">
              {PROPERTY_TYPE_LABELS[property.propertyType]}
            </span>
          </CardTitle>
          <CardDescription>
            {property.address ?? "No address on file"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Added {new Date(property.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
