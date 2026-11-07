'use strict';
// Public editorial picks, not rankings or firsthand reviews.
(function(root){const hotels=[
  {
    "id": "hoshinoya-kyoto",
    "name": "HOSHINOYA Kyoto",
    "location": "Arashiyama, Kyoto, Japan",
    "region": "Asia",
    "vibe": "Riverside culture",
    "officialUrl": "https://hoshinoresorts.com/en/hotels/hoshinoyakyoto/",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://hoshinoresorts.com/en/hotels/hoshinoyakyoto/"
      },
      {
        "name": "Official experiences",
        "url": "https://hoshinoresorts.com/en/hotels/hoshinoyakyoto/activities/"
      }
    ],
    "description": "A riverside retreat in Kyoto's Arashiyama area, with cultural activities that include a private boat outing and incense appreciation.",
    "insight": "Planning opinion: give the river setting its own unhurried day rather than treating this as just a bed between city sights.",
    "experiences": [
      "Hisui boat outing with matcha-making",
      "Introduction to Incense Ceremony"
    ],
    "checked": "2026-11-07"
  },
  {
    "id": "passalacqua",
    "name": "Passalacqua",
    "location": "Moltrasio, Lake Como, Italy",
    "region": "Europe",
    "vibe": "Lakeside villa",
    "officialUrl": "https://www.passalacqua.it/en/",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://www.passalacqua.it/en/"
      },
      {
        "name": "Official experiences",
        "url": "https://www.passalacqua.it/en/experiences/"
      }
    ],
    "description": "An 18th-century Lake Como villa hotel offering seasonal activities, gardens and excursions aboard vintage or modern motor launches.",
    "insight": "Planning opinion: choose one lake outing and leave the rest of the day open for the villa; confirm the seasonal activity calendar before arranging your stay.",
    "experiences": [
      "Skipper-led Lake Como boat excursion",
      "Gelato-making class on the seasonal activity calendar"
    ],
    "checked": "2026-11-07"
  },
  {
    "id": "soneva-fushi",
    "name": "Soneva Fushi",
    "location": "Baa Atoll, Maldives",
    "region": "Indian Ocean",
    "vibe": "Barefoot island",
    "officialUrl": "https://soneva.com/resorts/soneva-fushi/",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://soneva.com/resorts/soneva-fushi/"
      },
      {
        "name": "Official experiences",
        "url": "https://soneva.com/resorts/soneva-fushi/experiences/"
      }
    ],
    "description": "An island resort with jungle and overwater villas, an outdoor cinema and a studio where recycled glass becomes handmade pieces.",
    "insight": "Planning opinion: pair a sea-focused day with one island activity so the trip is more varied than a beach-only itinerary.",
    "experiences": [
      "Cinema Paradiso films beneath the night sky",
      "The Glass Studio's recycled-glass creative experience"
    ],
    "checked": "2026-11-07"
  },
  {
    "id": "royal-mansour-marrakech",
    "name": "Royal Mansour Marrakech",
    "location": "Marrakech, Morocco",
    "region": "Africa",
    "vibe": "Craft and courtyards",
    "officialUrl": "https://www.royalmansour.com/en/marrakech/",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://www.royalmansour.com/en/marrakech/"
      },
      {
        "name": "Official experiences",
        "url": "https://www.royalmansour.com/en/marrakech/signature-workshops/"
      }
    ],
    "description": "A Marrakech hotel arranged around private riads, gardens and alleyways, with culinary and creative workshops.",
    "insight": "Planning opinion: make a workshop the anchor of one day, then leave space for wandering rather than filling every hour with tours.",
    "experiences": [
      "Moroccan or Italian cooking workshop",
      "Patisserie workshop in the hotel kitchens"
    ],
    "checked": "2026-11-07"
  },
  {
    "id": "amangiri",
    "name": "Amangiri",
    "location": "Canyon Point, Utah, USA",
    "region": "North America",
    "vibe": "Desert adventure",
    "officialUrl": "https://www.aman.com/resorts/amangiri",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://www.aman.com/resorts/amangiri/experiences"
      }
    ],
    "description": "A Colorado Plateau resort with more than 12 miles of designated trails and guided adventures among sandstone mesas and slot canyons.",
    "insight": "Planning opinion: pick the activity level first, then choose a guided itinerary; ask about conditions and suitability rather than assuming every route fits every traveler.",
    "experiences": [
      "Guided via ferrata climbing on sandstone mesas",
      "Three slot-canyon tour led by a Navajo guide"
    ],
    "checked": "2026-11-07"
  },
  {
    "id": "raffles-singapore",
    "name": "Raffles Singapore",
    "location": "Singapore",
    "region": "Asia",
    "vibe": "City heritage",
    "officialUrl": "https://www.raffles.com/singapore/",
    "sources": [
      {
        "name": "Official hotel information",
        "url": "https://www.raffles.com/singapore/"
      },
      {
        "name": "Official experiences",
        "url": "https://www.raffles.com/singapore/whats-on/heritage-tour/"
      }
    ],
    "description": "A historic hotel opened in 1887, with suite accommodation, a heritage tour and afternoon tea in the Grand Lobby.",
    "insight": "Planning opinion: pair a hotel-history visit with one neighborhood outing to balance landmark luxury with a wider view of Singapore.",
    "experiences": [
      "Raffles Heritage Tour",
      "Afternoon tea in the Grand Lobby"
    ],
    "checked": "2026-11-07"
  }
];if(typeof module!=='undefined')module.exports=hotels;else root.VacationHotels=hotels;})(typeof window!=='undefined'?window:globalThis);
