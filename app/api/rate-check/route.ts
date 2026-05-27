import { NextResponse } from "next/server";

const FORMSPARK_ENDPOINT = "https://submit-form.com/ERoDYQUub";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createEnquiryReference() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `HRC-${year}${month}${day}-${randomCode}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const enquiryReference = createEnquiryReference();

  const payload = {
    form_name: "Hotel Rate Check Enquiry",
    enquiry_reference: enquiryReference,
    full_name: getFormValue(formData, "full_name"),
    email: getFormValue(formData, "email"),
    phone: getFormValue(formData, "phone"),
    hotel_name: getFormValue(formData, "hotel_name"),
    destination: getFormValue(formData, "destination"),
    check_in: getFormValue(formData, "check_in"),
    check_out: getFormValue(formData, "check_out"),
    adults: getFormValue(formData, "adults"),
    children: getFormValue(formData, "children"),
    price_found: getFormValue(formData, "price_found"),
    notes: getFormValue(formData, "notes"),
    submitted_at: new Date().toISOString(),
  };

  const response = await fetch(FORMSPARK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL("/?form=error", request.url), 303);
  }

  return NextResponse.redirect(
    new URL(`/thank-you?ref=${encodeURIComponent(enquiryReference)}`, request.url),
    303,
  );
}