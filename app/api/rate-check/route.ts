import { NextResponse } from "next/server";

const FORMSPARK_ENDPOINT = "https://submit-form.com/ERoDYQUub";

export async function POST(request: Request) {
  const formData = await request.formData();

  const payload = {
    form_name: "Hotel Rate Check Enquiry",
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    hotel_name: formData.get("hotel_name"),
    destination: formData.get("destination"),
    check_in: formData.get("check_in"),
    check_out: formData.get("check_out"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    price_found: formData.get("price_found"),
    notes: formData.get("notes"),
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

  return NextResponse.redirect(new URL("/thank-you", request.url), 303);
}