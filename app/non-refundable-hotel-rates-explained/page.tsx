import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "non-refundable-hotel-rates-explained";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
