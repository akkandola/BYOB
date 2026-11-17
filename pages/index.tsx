import Head from "next/head";
import { PropertiesSection } from "@/components/properties/PropertiesSection";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>BYOB — Be Your Own Builder</title>
        <meta
          name="description"
          content="Track appliances, warranties, insurance and DIY projects for every property you own."
        />
      </Head>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Be Your Own Builder
        </h1>
        <p className="mt-4 max-w-xl text-balance text-muted-foreground">
          Keep every property&apos;s appliances, warranties, insurance and
          improvement projects in one place, so nothing important slips
          through the cracks.
        </p>
      </section>
      <PropertiesSection />
    </>
  );
}
