import { NextResponse } from "next/server";

// Retired: the homepage enquiry form was replaced by live online search + booking
// (/search → /book). This endpoint previously relayed form posts to Formspark;
// it no longer does, to avoid an open unauthenticated relay. Remove fully locally:
//   git rm -r app/api/rate-check
export async function POST() {
  return NextResponse.json(
    { error: "This form has moved — please search for a hotel on the homepage." },
    { status: 410 },
  );
}
