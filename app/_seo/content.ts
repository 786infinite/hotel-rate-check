/**
 * Content registry for SEO service/guide pages. Each entry renders via
 * app/_seo/ServicePage.tsx. Keep copy DISTINCT per page (no near-duplicates) and
 * on-brand: hotel-only, no "cheapest guaranteed", no booking without approval,
 * always show cancellation terms and pay-at-hotel charges before payment.
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
    title: "Business Hotel Rate Check — Save on Staff & Work Travel",
    metaDescription:
      "Booking hotels for work? Send us the hotel and price and we check live supplier rates to see if we can improve it. Hotel-only, clear terms, no booking until you approve.",
    keywords: ["business hotel rate check", "corporate hotel booking", "staff travel hotels", "work trip hotel rates"],
    h1: "Business hotel rate check",
    intro:
      "If you book hotels for staff, projects or work trips, send us the hotel and the price you have found and we check live supplier rates for the same stay. Where we can improve on it, we send a clear quote with the full price, cancellation terms and any charges payable at the hotel. We handle hotel accommodation only, with no booking made until you approve.",
    sections: [
      {
        h2: "Built for how businesses actually book",
        body:
          "You usually know the hotel you want and just need the best sensible rate without spending an afternoon comparing tabs. Send us the details and we do the checking, then give you a straight answer: a quote if we can help, or an honest no if we cannot.",
      },
      {
        h2: "Clear costs before you commit",
        body:
          "Every quote shows the total price, whether it is refundable, the cancellation policy and any local taxes or fees payable directly at the hotel. Nothing is booked until you accept the terms and pay, and a booking is only confirmed once the supplier confirms it.",
      },
      {
        h2: "Suitable for single trips or regular travel",
        body:
          "Whether it is a one-off site visit or recurring staff stays, you can send each request as it comes up. For larger requirements we can look at multiple rooms; very large group bookings are handled individually.",
      },
    ],
    faqs: [
      { q: "Can you invoice my company?", a: "Get in touch with your requirements and we will confirm how payment and documentation work for your booking." },
      { q: "Do you book flights or packages?", a: "No. We provide hotel accommodation only — no flights, transfers or packages." },
      { q: "What if the rate changes before booking?", a: "Hotel rates are live. If a rate or availability changes before we can complete your booking, we offer an alternative or refund you in full." },
    ],
    ctaHeading: "Checking hotels for work?",
    ctaBody: "Send us the hotel and price and we will see whether we can improve it. Getting a quote is free.",
  },

  "group-hotel-rate-check": {
    slug: "group-hotel-rate-check",
    pageType: "service",
    title: "Group Hotel Rate Check — Multiple Rooms, One Clear Quote",
    metaDescription:
      "Booking several hotel rooms? Send us the details and we check live supplier rates for the group. Clear pricing, cancellation terms shown up front, no booking until you approve.",
    keywords: ["group hotel rate check", "multiple hotel rooms booking", "group accommodation rates", "team hotel booking"],
    h1: "Group hotel rate check",
    intro:
      "Booking several rooms for a team, event or family group? Send us the hotel, dates and number of rooms, and we check live supplier rates for the group. Where we can help, we send one clear quote covering the rooms, with cancellation terms and any pay-at-hotel charges shown before you pay.",
    sections: [
      {
        h2: "One request, one clear answer",
        body:
          "Instead of pricing rooms one by one, send the whole requirement and we check it together. You get a single quote you can review, accept and pay — no booking made until you approve.",
      },
      {
        h2: "Cancellation terms matter more for groups",
        body:
          "Group rooms can have stricter cancellation rules. We show the refundability and cancellation policy clearly before payment so you know exactly where you stand for the whole booking.",
      },
      {
        h2: "Large groups handled individually",
        body:
          "Bookings of around eight rooms or more are treated as group bookings and handled individually with the supplier, so we can confirm terms properly before anything is committed.",
      },
    ],
    faqs: [
      { q: "How many rooms can you check?", a: "From a couple of rooms upwards. Larger group bookings (around eight rooms or more) are handled individually." },
      { q: "Can everyone pay separately?", a: "Tell us how you would like to handle payment and we will let you know what is possible for your booking." },
      { q: "Are group rooms refundable?", a: "It depends on the rate. We always show whether a rate is refundable and its cancellation policy before you pay." },
    ],
    ctaHeading: "Booking rooms for a group?",
    ctaBody: "Send us the hotel, dates and number of rooms and we will check the rates. Getting a quote is free.",
  },

  "contractor-hotel-accommodation": {
    slug: "contractor-hotel-accommodation",
    pageType: "service",
    title: "Contractor Hotel Accommodation — Rate Checks for Project Teams",
    metaDescription:
      "Putting contractors or project teams up in hotels? Send us the hotel and price and we check live supplier rates, including for longer stays. Clear terms, no booking until you approve.",
    keywords: ["contractor hotel accommodation", "project team hotels", "construction crew accommodation", "long stay hotel rates"],
    h1: "Contractor & project-team hotel accommodation",
    intro:
      "If you arrange hotels for contractors, engineers or project crews, send us the hotel and the price you have, and we check live supplier rates for the same stay — including longer runs of nights. Where we can improve on it, you get a clear quote with cancellation terms and any pay-at-hotel charges shown before payment.",
    sections: [
      {
        h2: "Longer stays, checked properly",
        body:
          "Project work often means multi-night or multi-week stays near a site. Send the dates and we check what is available; we will be upfront about refundability and any charges the hotel collects directly.",
      },
      {
        h2: "No surprises for the person paying",
        body:
          "We show the full price, cancellation policy and any local taxes or fees payable at the hotel before you commit. Nothing is booked until you approve, and confirmation only follows once the supplier confirms.",
      },
      {
        h2: "Repeat requests welcome",
        body:
          "As crews and sites change, send each request as it comes up. We handle hotel accommodation only — no flights or packages.",
      },
    ],
    faqs: [
      { q: "Can you handle near-site hotels?", a: "Yes — send the hotel or area and dates and we will check available rates for that location." },
      { q: "What about long stays?", a: "We can check multi-night and longer stays. Refundability and cancellation terms are always shown before you pay." },
      { q: "Is anything booked automatically?", a: "No. We never book without your approval, and a booking is confirmed only after the supplier confirms it." },
    ],
    ctaHeading: "Booking hotels for a crew?",
    ctaBody: "Send the hotel, dates and price and we will check the rates, including longer stays. Quotes are free.",
  },

  "corporate-hotel-rate-check": {
    slug: "corporate-hotel-rate-check",
    pageType: "service",
    title: "Corporate Hotel Rate Check — Tidy, Transparent Work Bookings",
    metaDescription:
      "A simple way for companies to sanity-check hotel rates before booking. Send the hotel and price; we check live supplier rates and quote with clear terms. No booking until you approve.",
    keywords: ["corporate hotel rate check", "company hotel booking", "business travel hotel rates", "managed hotel bookings"],
    h1: "Corporate hotel rate check",
    intro:
      "A straightforward way for companies to check a hotel rate before booking. Send us the hotel and the price you have found and we check live supplier rates for the same stay, then quote clearly where we can help — with the full price, refundability, cancellation policy and any pay-at-hotel charges shown before payment.",
    sections: [
      {
        h2: "A second pair of eyes on every rate",
        body:
          "Rather than replacing your booking process, we add a quick check: is there a better sensible rate for this exact stay? You stay in control and only proceed if a quote works for you.",
      },
      {
        h2: "Transparent by design",
        body:
          "We never hide costs. Quotes set out the total, whether it is refundable, the cancellation terms and any charges the hotel collects directly, so approvals are simple and there are no surprises later.",
      },
      {
        h2: "Hotel-only, clearly scoped",
        body:
          "We provide hotel accommodation only — no flights, transfers, packages or linked travel arrangements. A booking is confirmed only once the supplier confirms it.",
      },
    ],
    faqs: [
      { q: "Do we have to change our travel process?", a: "No. Use us as a quick rate check before you book. You decide whether to proceed on each quote." },
      { q: "How do approvals work?", a: "Each quote shows the full cost and terms in one place, which makes internal sign-off straightforward." },
      { q: "What happens if a booking cannot be completed?", a: "If we cannot complete a paid booking with the supplier, we offer an alternative or refund in full." },
    ],
    ctaHeading: "Want a quick check before booking?",
    ctaBody: "Send the hotel and price and we will check our supplier rates. Getting a quote is free.",
  },

  "dubai-hotel-rate-check": {
    slug: "dubai-hotel-rate-check",
    pageType: "service",
    title: "Dubai Hotel Rate Check — Check Your Dubai Hotel Rate Before Booking",
    metaDescription:
      "Booking a Dubai hotel? Send us the hotel and price and we check live supplier rates. We also flag the Tourism Dirham and any fees payable at the hotel, with clear terms before you pay.",
    keywords: ["dubai hotel rate check", "dubai hotel price", "uae hotel rates", "dubai tourism dirham", "check dubai hotel rate"],
    h1: "Dubai hotel rate check",
    intro:
      "Planning a stay in Dubai? Send us the hotel and the price you have found and we check live supplier rates for the same stay. Dubai hotels often charge a Tourism Dirham and other fees directly at the hotel, so we make a point of showing those alongside the room price before you pay.",
    sections: [
      {
        h2: "We flag the pay-at-hotel charges",
        body:
          "In Dubai, a Tourism Dirham (a per-room, per-night fee) and occasional resort or service fees are commonly paid at the hotel rather than online. Where we are aware of these, we show them in your quote so you can compare the true total, not just the headline room price.",
      },
      {
        h2: "Clear terms before you commit",
        body:
          "Every quote shows the full room price, whether it is refundable and the cancellation policy. Many Dubai rates are non-refundable; if so, we make that clear and you must accept it before paying. Nothing is booked until you approve.",
      },
      {
        h2: "Hotel-only, no packages",
        body:
          "We provide hotel accommodation only — no flights or packages. A booking is confirmed only once the supplier confirms it, and if a paid booking cannot be completed we offer an alternative or refund in full.",
      },
    ],
    faqs: [
      { q: "What is the Tourism Dirham?", a: "It is a per-room, per-night fee charged by Dubai hotels, usually paid directly at the hotel at check-out. Where we know it applies, we show it in your quote." },
      { q: "Are Dubai rates refundable?", a: "Often not. We always show whether a rate is refundable and its cancellation policy before you pay." },
      { q: "Do you cover all of the UAE?", a: "Send us the hotel and we will check available supplier rates for that property and dates." },
    ],
    ctaHeading: "Booking a Dubai hotel?",
    ctaBody: "Send the hotel and price and we will check the rate and flag any pay-at-hotel fees. Quotes are free.",
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
      "A hotel price only means something when you compare it properly. The same room on two sites can look different once you account for board, cancellation terms and charges paid at the hotel. Here is a simple way to judge whether a rate is genuinely good before you commit.",
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
        h2: "Get a second opinion",
        body:
          "If you want someone to check whether a better sensible rate exists for the exact stay you have in mind, you can send it to us. We check supplier rates and tell you plainly whether we can improve on what you have.",
      },
    ],
    faqs: [
      { q: "Is the lowest price always the best deal?", a: "Not necessarily. A low room-only, non-refundable price with pay-at-hotel taxes can end up costing more or being riskier than a slightly higher flexible rate. Compare the true total and the terms." },
      { q: "What is the true total?", a: "The online price plus any taxes or fees the hotel charges directly at check-in or check-out." },
      { q: "How do I know if a rate is refundable?", a: "The rate or quote should state it. If it is not clear, treat it as non-refundable until confirmed." },
    ],
    ctaHeading: "Want us to check a specific rate?",
    ctaBody: "Send us the hotel, dates and price and we will tell you whether we can improve it. Getting a quote is free.",
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
    ctaHeading: "Not sure which rate to choose?",
    ctaBody: "Send us your hotel and dates and we will show you the options, including whether a rate is refundable, before you decide.",
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
          "Where we are aware of taxes or fees payable at the hotel, we show them in your quote before you pay, so you can see the true total rather than just the room price.",
      },
    ],
    faqs: [
      { q: "Why are these charges not in the online price?", a: "Many local taxes and resort fees are set to be collected by the hotel directly, so they sit outside the online room rate." },
      { q: "Do I pay them when I book or at the hotel?", a: "Usually at the hotel, at check-in or check-out. We flag them in your quote where we know they apply." },
      { q: "Are these charges refundable?", a: "Local taxes and fees are set by the hotel or authority and are generally payable regardless. Check the specific terms for your stay." },
    ],
    ctaHeading: "Want the true total before you book?",
    ctaBody: "Send us the hotel and dates and we will show the room price and any pay-at-hotel charges we are aware of.",
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
      { q: "Can you show me both options?", a: "Yes — send us the hotel and dates and we will show what is available, including whether each rate is refundable." },
    ],
    ctaHeading: "Weighing flexibility against price?",
    ctaBody: "Send us your hotel and dates and we will lay out the options and their cancellation terms so you can choose.",
  },
};
