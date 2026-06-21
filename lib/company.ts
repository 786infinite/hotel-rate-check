/** Registered company details — single source of truth. Env can override per-environment. */
export const COMPANY = {
  legalName: "786 Infinite Ltd",
  tradingName: "Hotel Rate Check",
  companyNumber: process.env.COMPANY_NUMBER ?? "12533644",
  vatNumber: process.env.COMPANY_VAT_NUMBER ?? "GB516006822",
  email: "quotes@hotelratecheck.com",
  address: {
    line1: "128 City Road",
    city: "London",
    postcode: "EC1V 2NX",
    country: "GB",
  },
  /** One-line address for inline display. */
  get addressLine() {
    return `${this.address.line1}, ${this.address.city}, ${this.address.postcode}`;
  },
};
