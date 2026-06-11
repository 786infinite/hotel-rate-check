import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "how-to-check-if-a-hotel-rate-is-good";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
