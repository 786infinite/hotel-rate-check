import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "hotel-local-taxes-explained";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
