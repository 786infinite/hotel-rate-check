/**
 * Offline fixtures drawn from the TBO API Specification v2.1 sample responses.
 *
 * Used by mock mode (TBO_MOCK=1) so the full flow — search, prebook, book,
 * bookingdetail — can be exercised locally and in the internal dashboard
 * BEFORE live credentials exist. Replace with real responses once certified.
 *
 * One fixture deliberately carries a "sold only with an airline ticket as part
 * of a package" RateCondition so the package-only filter can be demonstrated.
 */

import type {
  SearchResponse,
  PreBookResponse,
  BookResponse,
  BookingDetailResponse,
} from "./types";

export const MOCK_BOOKING_CODE =
  "1120548!TB!2!TB!9a47646b-1bba-4746-91d5-969149db1185";

/** Search → two rooms, AtProperty mandatory tax, RecommendedSellingRate present. */
export const mockSearchResponse: SearchResponse = {
  Status: { Code: 200, Description: "Successful" },
  HotelResult: [
    {
      HotelCode: "1120548",
      Currency: "GBP",
      Rooms: [
        {
          Name: ["Luxury Room, 1 King Bed"],
          BookingCode: MOCK_BOOKING_CODE,
          Inclusion: "Free WiFi",
          TotalFare: 152.88,
          TotalTax: 28.12,
          ExtraGuestCharges: "17.22",
          RecommendedSellingRate: "160.67",
          RoomPromotion: ["Private sale"],
          MealType: "Room_Only",
          IsRefundable: true,
          Supplements: [
            [
              {
                Index: 1,
                Type: "AtProperty",
                Description: "mandatory_tax",
                Price: 20.0,
                Currency: "AED",
              },
            ],
          ],
          WithTransfers: false,
        },
        {
          Name: ["Standard Twin Room, 2 Twin Beds"],
          BookingCode:
            "1120548!TB!4!TB!9a47646b-1bba-4746-91d5-969149db1185",
          Inclusion: "Free WiFi",
          TotalFare: 138.5,
          TotalTax: 24.0,
          RecommendedSellingRate: "150.00",
          MealType: "Room_Only",
          IsRefundable: false,
          Supplements: [
            [
              {
                Index: 1,
                Type: "AtProperty",
                Description: "mandatory_tax",
                Price: 20.0,
                Currency: "AED",
              },
            ],
          ],
          WithTransfers: false,
        },
      ],
    },
  ],
};

/** PreBook → refundable rate with detailed cancel policies and final RateConditions. */
export const mockPreBookResponse: PreBookResponse = {
  Status: { Code: 200, Description: "Successful" },
  HotelResult: [
    {
      HotelCode: "1120548",
      Currency: "GBP",
      Rooms: [
        {
          Name: ["Luxury Room, 1 King Bed"],
          BookingCode: MOCK_BOOKING_CODE,
          Inclusion: "Free WiFi",
          DayRates: [[{ BasePrice: 152.88 }]],
          TotalFare: 152.88,
          TotalTax: 28.12,
          ExtraGuestCharges: "17.22",
          RecommendedSellingRate: "160.67",
          RoomPromotion: ["Private sale"],
          CancelPolicies: [
            { FromDate: "01-08-2026 00:00:00", ChargeType: "Fixed", CancellationCharge: 0.0 },
            { FromDate: "28-07-2026 00:00:00", ChargeType: "Percentage", CancellationCharge: 100.0 },
          ],
          MealType: "Room_Only",
          IsRefundable: true,
          WithTransfers: false,
          Supplements: [
            [
              {
                Index: 1,
                Type: "AtProperty",
                Description: "Tourism Dirham (payable at hotel)",
                Price: 20.0,
                Currency: "AED",
              },
            ],
          ],
          Amenities: ["Free WiFi", "Air conditioning", "Minibar"],
        },
      ],
      RateConditions: [
        "W.e.f 31.03.2014, Government of Dubai is applying “Tourism Dirham” a fee ranging from AED 7-20 per room per night, payable at the hotel directly before check-out.",
        "Early check out will attract full cancellation charge unless otherwise specified.",
        "CheckIn Time-Begin: 3:00 PM",
        "CheckOut Time: 12:00 PM",
      ],
    },
  ],
};

/**
 * PreBook for a PACKAGE-ONLY rate (must be suppressed by the filter).
 * Keyed off a different BookingCode so mock mode can return it on demand.
 */
export const PACKAGE_ONLY_BOOKING_CODE =
  "1435427!TB!2!TB!a5419e54-559d-4607-a8ee-ce743288bd51";

export const mockPreBookPackageOnly: PreBookResponse = {
  Status: { Code: 200, Description: "Successful" },
  HotelResult: [
    {
      HotelCode: "1435427",
      Currency: "GBP",
      Rooms: [
        {
          Name: ["Standard Twin Room, 2 Large Twin Beds"],
          BookingCode: PACKAGE_ONLY_BOOKING_CODE,
          Inclusion: "Free WiFi",
          TotalFare: 17.1,
          TotalTax: 1.94,
          RoomPromotion: ["Save10%"],
          CancelPolicies: [
            { FromDate: "01-08-2026 00:00:00", ChargeType: "Fixed", CancellationCharge: 0.0 },
          ],
          MealType: "Room_Only",
          IsRefundable: true,
          WithTransfers: false,
        },
      ],
      RateConditions: [
        "Please note that this a special rate which should be sold only with an airline ticket as part of a package.",
        "CheckIn Time-Begin: 2:00 PM",
      ],
    },
  ],
};

export const mockBookResponse: BookResponse = {
  Status: { Code: 200, Description: "Successful" },
  ClientReferenceId: "mock-client-ref",
  ConfirmationNumber: "MOCKFL1IMA",
};

export const mockBookingDetailResponse: BookingDetailResponse = {
  Status: { Code: 200, Description: "Successful" },
  BookingDetail: {
    BookingStatus: "Confirmed",
    VoucherStatus: true,
    ConfirmationNumber: "MOCKFL1IMA",
    HotelConfirmationNumber: "HCN-MOCK-001",
    InvoiceNumber: "MW34325",
    CheckIn: "2026-08-01T00:00:00",
    CheckOut: "2026-08-03T00:00:00",
    BookingDate: "2026-06-10T00:00:00",
    NoOfRooms: 1,
    HotelDetails: {
      HotelName: "Golden Sands Hotel Apartments",
      Rating: "ThreeStar",
      Map: "25.251559|55.295027",
      City: "Dubai",
    },
    Rooms: [
      {
        Currency: "GBP",
        Name: ["Luxury Room, 1 King Bed"],
        Inclusion: "ROOM ONLY",
        TotalFare: 152.88,
        TotalTax: 28.12,
        RoomPromotion: ["Private sale"],
        CancelPolicies: [
          { FromDate: "28-07-2026 00:00:00", ChargeType: "Percentage", CancellationCharge: 100.0 },
        ],
        MealType: "Room_Only",
        IsRefundable: true,
        CustomerDetails: [
          {
            CustomerNames: [
              { Title: "Mr", FirstName: "Test", LastName: "Guest", Type: "Adult" },
            ],
          },
        ],
      },
    ],
    RateConditions: ["20.00 AED payable at arrival in hotel."],
  },
};
