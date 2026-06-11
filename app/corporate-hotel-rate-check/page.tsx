import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "corporate-hotel-rate-check";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
