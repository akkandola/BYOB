import Head from "next/head";
import { useRouter } from "next/router";
import { ComingSoonFeature } from "@/components/properties/ComingSoonFeature";

export default function HomeManagerPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  if (!id) return null;

  return (
    <>
      <Head>
        <title>Home Manager — BYOB</title>
      </Head>
      <ComingSoonFeature
        propertyId={id}
        title="Home Manager"
        description="Track appliances, warranties, insurance and inspections."
      />
    </>
  );
}
