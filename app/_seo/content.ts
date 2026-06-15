/**
 * Content registry for SEO service/guide pages. Each entry renders via
 * app/_seo/ServicePage.tsx. Keep copy DISTINCT per page (no near-duplicates) and
 * on-brand: hotel-only, no "cheapest guaranteed", full price and terms (including
 * cancellation policy and any pay-at-hotel charges) shown before payment.
 *
 * Positioning: online hotel booking. We check the live rate and book it for you
 * online — NOT a manual "send us your price and we'll get back to you" service.
 * A booking is confirmed once the hotel confirms it; we email the confirmation/voucher.
 *
 * Add a new page = add an entry here + a thin route file + a sitemap line.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceContent {
  slug: string;
  pageType: "service" | "article";
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faqs: Faq[];
  ctaHeading: string;
  ctaBody: string;
}

export const SEO_CONTENT: Record<string, ServiceContent> = {
  "business-hotel-rate-check": {
    slug: "business-hotel-rate-check",
    pageType: "service",
    title: "Business Hotel Rate Check — Book Staff & Work Travel Online",
    metaDescription:
      "Book hotels for staff and work trips online. See the live rate with the full price, cancellation terms and any pay-at-hotel charges before you pay. Hotel accommodation only.",
    keywords: ["business hotel rate check", "corporate hotel booking", "staff travel hotels", "book work trip hotels"],
    h1: "Business hotel booking",
    intro:
      "Booking hotels for staff, projects or work trips? Search the hotel and dates, see the live rate with the full price and terms up front, and book and pay online in one place. We deal with hotel accommodation only — no flights, packages or upsells.",
    sections: [
      {
        h2: "Built for how businesses actually book",
        body:
          "You usually know the hotel you want and just need a clear price and a clean booking without spending an afternoon comparing tabs. Search it, see the live rate, and book — with the total cost and the cancellation terms shown before you pay.",
      },
      {
        h2: "Clear costs before you commit",
        body:
          "Every booking shows the total price, whether the rate is refundable, the cancellation policy and any local taxes or fees payable directly at the hotel. Nothing is charged until you accept the terms and pay, and your booking is confirmed once the hotel confirms it.",
      },
      {
        h2: "Single trips or regular travel",
        body:
          "Whether it is a one-off site visit or recurring staff stays, book each one as it comes up. For several rooms we can help with multiple-room bookings; very large group bookings are handled individually.",
      },
    ],
    faqs: [
      { q: "Can you invoice my company?", a: "Get in touch with your requirements and we will confirm the payment and documentation options for your booking." },
      { q: "Do you book flights or packages?", a: "No. We provide hotel accommodation only — no flights, transfers or packages." },
      { q: "What if the rate changes before my booking is confirmed?", a: "Hotel rates are live. If a rate or availability changes before your booking is confirmed, we offer a suitable alternative or refund you in full." },
    ],
    ctaHeading: "Booking hotels for work?",
    ctaBody: "Search your hotel and dates and book online — full price and terms shown before you pay.",
  },

  "group-hotel-rate-check": {
    slug: "group-hotel-rate-check",
    pageType: "service",
    title: "Group Hotel Rate Check — Book Multiple Rooms Online",
    metaDescription:
      "Booking several hotel rooms? Book your group online with clear pricing and cancellation terms shown up front. Hotel accommodation only.",
    keywords: ["group hotel rate check", "book multiple hotel rooms", "group accommodation booking", "team hotel booking"],
    h1: "Group hotel booking",
    intro:
      "Booking several rooms for a team, event or family group? Tell us the hotel, dates and number of rooms and book the group online, with the cancellation terms and any pay-at-hotel charges shown before you pay.",
    sections: [
      {
        h2: "Several rooms, one clear booking",
        body:
          "Instead of pricing rooms one at a time, handle the whole group together. You see one clear total you can review and pay, with the terms shown before anything is charged.",
      },
      {
        h2: "Cancellation terms matter more for groups",
        body:
          "Group rooms can carry stricter cancellation rules. We show refundability and the cancellation policy clearly before payment, so you know exactly where you stand for the whole booking.",
      },
      {
        h2: "Large groups handled individually",
        body:
          "Bookings of around eight rooms or more are treated as group bookings and handled individually with the hotel, so terms are confirmed properly before anything is committed.",
      },
    ],
    faqs: [
      { q: "How many rooms can I book?", a: "From a couple of rooms upwards. Larger group bookings (around eight rooms or more) are handled individually." },
      { q: "Can everyone pay separately?", a: "Tell us how you would like to handle payment and we will let you know what is possible for your booking." },
      { q: "Are group rooms refundable?", a: "It depends on the rate. We always show whether a rate is refundable and its cancellation policy before you pay." },
    ],
    ctaHeading: "Booking rooms for a group?",
    ctaBody: "Tell us the hotel, dates and number of rooms and book the group online — terms shown before you pay.",
  },

  "contractor-hotel-accommodation": {
    slug: "contractor-hotel-accommodation",
    pageType: "service",
    title: "Contractor Hotel Accommodation — Book Project-Team Stays Online",
    metaDescription:
      "Putting contractors or project teams up in hotels? Book online, including longer stays, with clear terms and any pay-at-hotel charges shown before you pay. Hotel accommodation only.",
    keywords: ["contractor hotel accommodation", "project team hotels", "construction crew accommodation", "book long stay hotels"],
    h1: "Contractor & project-team hotel accommodation",
    intro:
      "Arranging hotels for contractors, engineers or project crews? Book the stay online — including longer runs of nights — with the full price, cancellation terms and any pay-at-hotel charges shown before payment. Hotel accommodation only.",
    sections: [
      {
        h2: "Longer stays, booked cleanly",
        body:
          "Project work often means multi-night or multi-week stays near a site. Search the dates, see what is available, and book — with refundability and any charges the hotel collects directly made clear up front.",
      },
      {
        h2: "No surprises for the person paying",
        body:
          "You see the full price, the cancellation policy and any local taxes or fees payable at the hotel before you commit. Nothing is charged until you accept the terms, and your booking is confirmed once the hotel confirms it.",
      },
      {
        h2: "Repeat bookings welcome",
        body:
          "As crews and sites change, book each stay as it comes up. We handle hotel accommodation only — no flights or packages.",
      },
    ],
    faqs: [
      { q: "Can you handle near-site hotels?", a: "Yes — search the hotel or area and dates and book whatever is available for that location." },
      { q: "What about long stays?", a: "You can book multi-night and longer stays. Refundability and cancellation terms are always shown before you pay." },
      { q: "When is my booking confirmed?", a: "Your booking is confirmed once the hotel confirms it, and we email your confirmation or voucher." },
    ],
    ctaHeading: "Booking hotels for a crew?",
    ctaBody: "Search the hotel and dates and book online, including longer stays — terms shown before you pay.",
  },

  "corporate-hotel-rate-check": {
    slug: "corporate-hotel-rate-check",
    pageType: "service",
    title: "Corporate Hotel Rate Check — Transparent Work Bookings Online",
    metaDescription:
      "A simple way for companies to book hotels online with clear, transparent pricing. See the live rate, full price and cancellation terms before you pay. Hotel accommodation only.",
    keywords: ["corporate hotel rate check", "company hotel booking", "business travel hotel booking", "managed hotel bookings"],
    h1: "Corporate hotel booking",
    intro:
      "A straightforward way for companies to book hotels online. Search the hotel and dates, see the live rate, and book — with the full price, refundability, cancellation policy and any pay-at-hotel charges shown before payment.",
    sections: [
      {
        h2: "Clear rates, clean bookings",
        body:
          "See the live rate for the exact stay and book it in one place. You stay in control of the cost and the terms, with everything shown before you pay.",
      },
      {
        h2: "Transparent by design",
        body:
          "We never hide costs. Each booking sets out the total, whether it is refundable, the cancellation terms and any charges the hotel collects directly — so approvals are simple and there are no surprises later.",
      },
      {
        h2: "Hotel-only, clearly scoped",
        body:
          "We provide hotel accommodation only — no flights, transfers, packages or linked travel arrangements. A booking is confirmed once the hotel confirms it.",
      },
    ],
    faqs: [
      { q: "Do we have to change our travel process?", a: "No. Use us to book hotels online whenever you need to. You see the full cost and terms before you pay." },
      { q: "How do approvals work?", a: "Each booking shows the full cost and terms in one place, which makes internal sign-off straightforward." },
      { q: "What happens if a booking cannot be completed?", a: "If we cannot complete a paid booking with the hotel, we offer a suitable alternative or refund you in full." },
    ],
    ctaHeading: "Booking company hotels?",
    ctaBody: "Search the hotel and dates and book online — full price and terms shown before you pay.",
  },

  "how-to-check-if-a-hotel-rate-is-good": {
    slug: "how-to-check-if-a-hotel-rate-is-good",
    pageType: "article",
    title: "How to Check if a Hotel Rate Is Good — A Simple Guide",
    metaDescription:
      "A practical guide to judging whether a hotel rate is actually good: compare like-for-like, watch pay-at-hotel charges, and weigh refundable against non-refundable before you book.",
    keywords: ["how to check hotel rate", "is my hotel rate good", "compare hotel prices", "hotel booking tips"],
    h1: "How to check if a hotel rate is good",
    intro:
      "A hotel price only means something when you compare it properly. The same room on two sites can look different once you account for board, cancellation terms and charges paid at the hotel. Here is a simple way to judge whether a rate is genuinely good before you book.",
    sections: [
      {
        h2: "Compare like-for-like",
        body:
          "Make sure you are comparing the same hotel, the same dates, the same room type, the same board basis (room only versus breakfast), the same number of guests and the same cancellation policy. A cheaper room-only rate is not really cheaper than a breakfast-inclusive one, and a non-refundable rate is not comparable to a flexible one.",
      },
      {
        h2: "Add the charges paid at the hotel",
        body:
          "Some hotels charge city or tourism taxes, resort fees or deposits directly at check-in. These are easy to miss because they are not always in the headline price. To compare fairly, add any pay-at-hotel charges to the online price to get the true total.",
      },
      {
        h2: "Decide what flexibility is worth",
        body:
          "Non-refundable rates are usually cheaper but you lose the money if plans change. A flexible rate costs more but lets you cancel. Neither is automatically better — it depends on how certain your plans are.",
      },
      {
        h2: "Book with the full picture",
        body:
          "When you book with us, the live rate is shown with the full price, whether it is refundable, the cancellation policy and any pay-at-hotel charges — so you can see the true total and the terms before you pay.",
      },
    ],
    faqs: [
      { q: "Is the lowest price always the best deal?", a: "Not necessarily. A low room-only, non-refundable price with pay-at-hotel taxes can end up costing more or being riskier than a slightly higher flexible rate. Compare the true total and the terms." },
      { q: "What is the true total?", a: "The online price plus any taxes or fees the hotel charges directly at check-in or check-out." },
      { q: "How do I know if a rate is refundable?", a: "It is shown before you pay. If refundability is not clear, treat the rate as non-refundable until confirmed." },
    ],
    ctaHeading: "Ready to book?",
    ctaBody: "Search your hotel and dates and book online — the full price, terms and any pay-at-hotel charges are shown before you pay.",
  },

  "non-refundable-hotel-rates-explained": {
    slug: "non-refundable-hotel-rates-explained",
    pageType: "article",
    title: "Non-Refundable Hotel Rates Explained",
    metaDescription:
      "What non-refundable hotel rates mean, why they are cheaper, the risks, and when they make sense. Plus what to check before you book a non-refundable rate.",
    keywords: ["non-refundable hotel rate", "non refundable booking", "prepaid hotel rate", "hotel cancellation"],
    h1: "Non-refundable hotel rates explained",
    intro:
      "Non-refundable rates are some of the cheapest hotel prices you will see — but they come with a clear trade-off. Here is what they actually mean, why they cost less, and when choosing one is sensible.",
    sections: [
      {
        h2: "What non-refundable means",
        body:
          "With a non-refundable rate you pay up front and, if you cancel or do not show up, you usually do not get your money back. The booking also often cannot be changed (different dates or names) once made.",
      },
      {
        h2: "Why they are cheaper",
        body:
          "The hotel takes on less risk because it has your payment and a guaranteed booking, so it passes some of that saving on. Flexibility has a cost; giving it up is what makes the rate lower.",
      },
      {
        h2: "When a non-refundable rate makes sense",
        body:
          "They suit firm plans — confirmed dates, confirmed travellers, a trip that is definitely happening. If there is a real chance your plans change, the saving may not be worth the risk of losing the whole amount.",
      },
      {
        h2: "What to check first",
        body:
          "Confirm it is genuinely non-refundable, check the exact dates, room and guest names, and note any taxes or fees payable at the hotel. Once a non-refundable booking is confirmed it generally cannot be undone except where the law requires it.",
      },
    ],
    faqs: [
      { q: "Can I ever get a refund on a non-refundable rate?", a: "Usually not, except where required by law or where the accommodation is not provided as confirmed. Always check before booking." },
      { q: "Can I change the dates?", a: "Non-refundable rates are typically also non-amendable. Treat dates, names and room as fixed once booked." },
      { q: "Are non-refundable rates worth it?", a: "If your plans are firm, the saving can be worthwhile. If not, a flexible rate may be the safer choice." },
    ],
    ctaHeading: "Choosing your rate?",
    ctaBody: "Search your hotel and dates and book online — whether each rate is refundable is shown before you pay.",
  },

  "hotel-local-taxes-explained": {
    slug: "hotel-local-taxes-explained",
    pageType: "article",
    title: "Hotel Local Taxes & Pay-at-Hotel Charges Explained",
    metaDescription:
      "City taxes, tourism fees, resort fees and the Dubai Tourism Dirham: what they are, why they are often paid at the hotel, and how to compare the true cost of a stay.",
    keywords: ["hotel local taxes", "tourism tax", "resort fees", "tourism dirham", "pay at hotel charges"],
    h1: "Hotel local taxes and pay-at-hotel charges explained",
    intro:
      "The price you see online is not always the full cost of a stay. Many destinations add local taxes or fees that the hotel collects directly at check-in or check-out. Here is what they are and how to factor them in.",
    sections: [
      {
        h2: "Common pay-at-hotel charges",
        body:
          "These include city or tourism taxes (a per-night charge set by local government), resort or facility fees, and deposits for incidentals. They are often not included in the online room price and are payable directly to the hotel.",
      },
      {
        h2: "The Dubai Tourism Dirham",
        body:
          "In Dubai, hotels charge a Tourism Dirham — a per-room, per-night fee — usually paid at the hotel at check-out. It is a good example of a charge that does not appear in the headline price but adds to the true total.",
      },
      {
        h2: "How to compare the true cost",
        body:
          "To compare two prices fairly, add any pay-at-hotel charges to each online price. A rate that looks cheaper online can end up dearer once local taxes are included.",
      },
      {
        h2: "How we handle it",
        body:
          "Where we are aware of taxes or fees payable at the hotel, we show them before you pay, so you see the true total rather than just the room price.",
      },
    ],
    faqs: [
      { q: "Why are these charges not in the online price?", a: "Many local taxes and resort fees are set to be collected by the hotel directly, so they sit outside the online room rate." },
      { q: "Do I pay them when I book or at the hotel?", a: "Usually at the hotel, at check-in or check-out. We flag them before you pay where we know they apply." },
      { q: "Are these charges refundable?", a: "Local taxes and fees are set by the hotel or authority and are generally payable regardless. Check the specific terms for your stay." },
    ],
    ctaHeading: "Want the true total before you book?",
    ctaBody: "Search the hotel and dates and book online — the room price and any pay-at-hotel charges we are aware of are shown before you pay.",
  },

  "free-cancellation-vs-cheaper-hotel-rates": {
    slug: "free-cancellation-vs-cheaper-hotel-rates",
    pageType: "article",
    title: "Free Cancellation vs Cheaper Hotel Rates — Which to Choose",
    metaDescription:
      "Flexible free-cancellation rates cost more; non-refundable rates are cheaper. A clear way to decide which is right for your trip based on how firm your plans are.",
    keywords: ["free cancellation hotel", "flexible vs non-refundable", "hotel cancellation policy", "cheaper hotel rate"],
    h1: "Free cancellation vs cheaper hotel rates",
    intro:
      "Most hotels offer two kinds of rate for the same room: a flexible one you can cancel, and a cheaper one you cannot. Choosing well is mostly about how certain your plans are. Here is how to decide.",
    sections: [
      {
        h2: "What you are really trading",
        body:
          "A free-cancellation rate costs more but lets you change your mind up to a deadline. A non-refundable rate is cheaper but you commit your money up front. You are paying for flexibility, or trading it away for a lower price.",
      },
      {
        h2: "When flexibility is worth paying for",
        body:
          "If dates might move, travellers are not confirmed, or the trip itself is not certain, the ability to cancel can be worth the extra cost — especially on higher-value stays.",
      },
      {
        h2: "When the cheaper rate wins",
        body:
          "If the stay is locked in, the non-refundable rate usually saves money with little downside. Just double-check the dates, names and room before you commit, because you cannot undo it.",
      },
      {
        h2: "A quick rule of thumb",
        body:
          "Ask how much you would lose if you had to cancel, and how likely that is. If the risk feels real, pay for flexibility. If not, take the saving.",
      },
    ],
    faqs: [
      { q: "Is free cancellation always more expensive?", a: "Usually, yes — the flexibility carries a cost. The gap varies by hotel and date." },
      { q: "Until when can I cancel a flexible rate?", a: "Each rate has its own cancellation deadline. Always check the policy shown before you book." },
      { q: "Can I see both options?", a: "Yes — search the hotel and dates and you will see what is available, including whether each rate is refundable, before you pay." },
    ],
    ctaHeading: "Weighing flexibility against price?",
    ctaBody: "Search your hotel and dates and book online — each rate and its cancellation terms are shown so you can choose.",
  },
};
