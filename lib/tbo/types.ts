/**
 * TBO Holidays Hotel API — TypeScript types
 * Source: TBOH Hotel API Specification v2.1
 *
 * These mirror the exact JSON field names returned/accepted by TBO.
 * Do not rename fields — they must match the wire format.
 */

// ---------------------------------------------------------------------------
// Enumerations (spec §17)
// ---------------------------------------------------------------------------

export type PaxType = "Adult" | "Child";

/** Search filter meal plan. */
export type MealPlan = "All" | "WithMeal" | "RoomOnly";

export type StarRating =
  | "All"
  | "OneStar"
  | "TwoStar"
  | "ThreeStar"
  | "FourStar"
  | "FiveStar";

export type PaymentMode = "Limit" | "SavedCard" | "NewCard";

export type BookingType = "Voucher";

/** Meal type returned on a rate. */
export type MealType =
  | "All_Inclusive_All_Meal"
  | "Full_Board"
  | "Half_Board"
  | "Room_Only"
  | "BreakFast"
  | "Lunch"
  | "Dinner"
  | "BreakFast_Lunch"
  | "Breakfast_For_1"
  | "Breakfast_For_2";

export type BookingStatus =
  | "Confirmed"
  | "Cancelled"
  | "CancellationInProgress"
  | "CancelPending"
  | "CxlRequestSentToHotel"
  | "CancelledAndRefundAwaited";

/** Supplement charge type. "AtProperty" must be shown to the guest before payment. */
export type SupplementType = "Included" | "AtProperty";

// ---------------------------------------------------------------------------
// Shared structures
// ---------------------------------------------------------------------------

export interface TboStatus {
  Code: number;
  Description: string;
}

export interface CancelPolicy {
  /** Room index the policy applies to. If missing, applies to the whole booking. */
  Index?: string;
  /** Format: "DD-MM-YYYY HH:mm:ss" */
  FromDate: string;
  /** e.g. "Fixed" | "Percentage" */
  ChargeType: string;
  CancellationCharge: number;
}

export interface Supplement {
  Index: number;
  Type: SupplementType;
  Description: string;
  Price: number;
  Currency: string;
}

export interface DayRate {
  BasePrice: number;
}

export interface CreditCardBillingOption {
  // Shape varies; kept loose until exercised against staging.
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Search (spec §6)
// ---------------------------------------------------------------------------

export interface PaxRoom {
  /** 1-8 per room */
  Adults: number;
  /** 0-4 per room */
  Children: number;
  /** Ages 0-18, length === Children */
  ChildrenAges: number[];
}

export interface SearchFilters {
  Refundable?: boolean;
  /** Max number of rooms to return; 0 = no cap */
  NoOfRooms?: number;
  MealType?: MealPlan;
}

export interface SearchRequest {
  /** YYYY-MM-DD */
  CheckIn: string;
  /** YYYY-MM-DD */
  CheckOut: string;
  /** Comma-separated TBO hotel codes (recommended ≤100) */
  HotelCodes: string;
  /** ISO 3166-1 alpha-2, e.g. "AE" */
  GuestNationality: string;
  PaxRooms: PaxRoom[];
  /** Expected response time (seconds) */
  ResponseTime?: number;
  /** Keep false to reduce payload size (spec Key Points) */
  IsDetailedResponse?: boolean;
  Filters?: SearchFilters;
}

export interface RoomResult {
  /** First element = first room, etc. */
  Name: string[];
  /** Unique bookable-unit identifier, passed to PreBook/Book */
  BookingCode: string;
  Inclusion?: string;
  DayRates?: DayRate[][];
  BasePrice?: number;
  TotalFare: number;
  TotalTax: number;
  ExtraGuestCharges?: string;
  /** Minimum legal B2C selling rate — must not sell below this when present */
  RecommendedSellingRate?: string;
  RoomPromotion?: string[];
  CancelPolicies?: CancelPolicy[];
  MealType?: MealType;
  IsRefundable: boolean;
  WithTransfers?: boolean;
  /** Array per room of supplement arrays */
  Supplements?: Supplement[][];
}

export interface HotelSearchResult {
  HotelCode: string;
  Currency: string;
  Rooms: RoomResult[];
}

export interface SearchResponse {
  Status: TboStatus;
  HotelResult?: HotelSearchResult[];
}

// ---------------------------------------------------------------------------
// PreBook (spec §7)
// ---------------------------------------------------------------------------

export interface PreBookRequest {
  BookingCode: string;
  /** Default "Limit" */
  PaymentMode?: PaymentMode;
}

export interface PreBookRoomResult extends RoomResult {
  /** Hotel/room norms — scan for package-only/airline restrictions */
  // RateConditions lives at hotel level (see PreBookHotelResult)
  Amenities?: string[];
}

export interface PreBookHotelResult {
  HotelCode: string;
  Currency: string;
  Rooms: PreBookRoomResult[];
  /** Final cancellation/norms text. Authoritative per spec Key Points. */
  RateConditions?: string[];
  CreditCardBillingOptions?: CreditCardBillingOption[];
}

export interface PreBookResponse {
  Status: TboStatus;
  HotelResult?: PreBookHotelResult[];
}

// ---------------------------------------------------------------------------
// Book (spec §8)
// ---------------------------------------------------------------------------

export interface CustomerName {
  Title: "Mr" | "Mrs" | "Ms";
  FirstName: string;
  LastName: string;
  Type: PaxType;
}

export interface CustomerDetail {
  CustomerNames: CustomerName[];
}

export interface CardHolderAddress {
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  PostalCode: string;
  /** ISO 3166-1 alpha-2 */
  CountryCode: string;
}

/** Only required for NewCard/SavedCard. Not used in the Limit (credit-line) flow. */
export interface PaymentInfo {
  CvvNumber: string;
  CardNumber?: string;
  CardExpirationMonth?: string;
  CardExpirationYear?: string;
  CardHolderFirstName?: string;
  CardHolderLastName?: string;
  BillingAmount?: number;
  BillingCurrency?: string;
  CardHolderAddress?: CardHolderAddress;
}

export interface BookRequest {
  BookingCode: string;
  CustomerDetails: CustomerDetail[];
  /** Internal tracking id */
  ClientReferenceId: string;
  /** Idempotency anchor — must be unique per Book attempt, ≤25 chars */
  BookingReferenceId: string;
  TotalFare: number;
  EmailId: string;
  PhoneNumber: string;
  /** Default "Voucher" */
  BookingType?: BookingType;
  /** Default "Limit" (book against TBO credit line) */
  PaymentMode?: PaymentMode;
  PaymentInfo?: PaymentInfo;
}

export interface BookResponse {
  Status: TboStatus;
  ClientReferenceId?: string;
  /** TBO-generated confirmation number */
  ConfirmationNumber?: string;
}

// ---------------------------------------------------------------------------
// Cancel (spec §9)
// ---------------------------------------------------------------------------

export interface CancelRequest {
  ConfirmationNumber: string;
}

export interface CancelResponse {
  Status: TboStatus;
  ConfirmationNumber?: string;
}

// ---------------------------------------------------------------------------
// BookingDetail (spec §10)
// ---------------------------------------------------------------------------

export interface BookingDetailRequest {
  /** Provide one of ConfirmationNumber or BookingReferenceId */
  ConfirmationNumber?: string;
  BookingReferenceId?: string;
  /** Default "Limit" */
  PaymentMode?: PaymentMode;
}

export interface BookingDetailHotel {
  HotelName: string;
  Rating?: StarRating;
  AddressLine1?: string;
  AddressLine2?: string;
  /** "lat|lng" */
  Map?: string;
  City?: string;
}

export interface BookingDetailRoom {
  Currency: string;
  Name: string[];
  Inclusion?: string;
  TotalFare: number;
  TotalTax: number;
  RoomPromotion?: string[];
  CancelPolicies?: CancelPolicy[];
  MealType?: MealType;
  IsRefundable: boolean;
  Supplements?: Supplement[][];
  CustomerDetails?: CustomerDetail[];
}

export interface BookingDetail {
  BookingStatus: BookingStatus;
  /** Spec types this as Boolean but documents values Confirm/Voucher — treat loosely */
  VoucherStatus: boolean | string;
  ConfirmationNumber: string;
  HotelConfirmationNumber?: string;
  InvoiceNumber?: string;
  CheckIn: string;
  CheckOut: string;
  BookingDate: string;
  NoOfRooms: number;
  HotelDetails: BookingDetailHotel;
  Rooms: BookingDetailRoom[];
  RateConditions?: string[];
  CreditCardOptions?: CreditCardBillingOption[];
}

export interface BookingDetailResponse {
  Status: TboStatus;
  BookingDetail?: BookingDetail;
}
