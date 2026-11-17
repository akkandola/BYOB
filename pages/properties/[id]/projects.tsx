import Head from "next/head";
import { useRouter } from "next/router";
import { ComingSoonFeature } from "@/components/properties/ComingSoonFeature";

export default function ProjectsPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  if (!id) return null;

  return (
    <>
      <Head>
        <title>DIY Projects — BYOB</title>
      </Head>
      <ComingSoonFeature
        propertyId={id}
        title="DIY Projects"
        description="Plan and track improvement projects."
      />
    </>
  );
}
