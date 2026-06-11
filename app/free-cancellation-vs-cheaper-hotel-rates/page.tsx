import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "free-cancellation-vs-cheaper-hotel-rates";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
