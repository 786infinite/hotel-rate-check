import ServicePage, { buildServiceMetadata } from "@/app/_seo/ServicePage";

const SLUG = "contractor-hotel-accommodation";
export const metadata = buildServiceMetadata(SLUG);
export default function Page() {
  return <ServicePage slug={SLUG} />;
}
