import { BandLinks, Member, Show, Song, SongEnergy, StageHandState } from "../types/stagehand";

export const STORAGE_KEY = "stagehand-mobile-state-v2";

export const createId = () => Math.random().toString(36).slice(2, 10);

export const dateFromToday = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

export const nextFriday = () => {
  const date = new Date();
  const day = date.getDay();
  const distance = (5 - day + 7) % 7 || 7;
  date.setDate(date.getDate() + distance);
  return date.toISOString().slice(0, 10);
};

export const buildSeedState = (): StageHandState => {
  const songs: Song[] = [
    { id: createId(), title: "Dreams", artist: "Fleetwood Mac", energy: "Mid" },
    { id: createId(), title: "Mr. Brightside", artist: "The Killers", energy: "High" },
    { id: createId(), title: "Tennessee Whiskey", artist: "Chris Stapleton", energy: "Low" },
    { id: createId(), title: "Valerie", artist: "Amy Winehouse", energy: "Mid" },
    { id: createId(), title: "Shut Up and Dance", artist: "Walk the Moon", energy: "High" },
    { id: createId(), title: "Proud Mary", artist: "Creedence Clearwater Revival", energy: "High" },
    { id: createId(), title: "Jolene", artist: "Dolly Parton", energy: "Mid" },
    { id: createId(), title: "Brown Eyed Girl", artist: "Van Morrison", energy: "Mid" },
    { id: createId(), title: "Rolling in the Deep", artist: "Adele", energy: "High" },
    { id: createId(), title: "Fast Car", artist: "Tracy Chapman", energy: "Low" },
    { id: createId(), title: "Take Me Home, Country Roads", artist: "John Denver", energy: "Mid" },
    { id: createId(), title: "Don't Stop Believin'", artist: "Journey", energy: "High" },
    { id: createId(), title: "Watermelon Sugar", artist: "Harry Styles", energy: "Mid" },
    { id: createId(), title: "I Wanna Dance with Somebody", artist: "Whitney Houston", energy: "High" },
    { id: createId(), title: "Landslide", artist: "Fleetwood Mac", energy: "Low" },
    { id: createId(), title: "Wonderwall", artist: "Oasis", energy: "Mid" },
    { id: createId(), title: "Levitating", artist: "Dua Lipa", energy: "High" },
    { id: createId(), title: "Use Somebody", artist: "Kings of Leon", energy: "Mid" },
    { id: createId(), title: "Before He Cheats", artist: "Carrie Underwood", energy: "High" },
    { id: createId(), title: "No Diggity", artist: "Blackstreet", energy: "Mid" },
    { id: createId(), title: "Ho Hey", artist: "The Lumineers", energy: "Mid" },
    { id: createId(), title: "Faith", artist: "George Michael", energy: "High" },
    { id: createId(), title: "Ain't No Sunshine", artist: "Bill Withers", energy: "Low" },
    { id: createId(), title: "Sweet Caroline", artist: "Neil Diamond", energy: "Mid" },
    { id: createId(), title: "Ex's & Oh's", artist: "Elle King", energy: "High" },
    { id: createId(), title: "Kiss", artist: "Prince", energy: "High" },
    { id: createId(), title: "Georgia on My Mind", artist: "Ray Charles", energy: "Low" },
    { id: createId(), title: "Good as Hell", artist: "Lizzo", energy: "High" },
    { id: createId(), title: "Riptide", artist: "Vance Joy", energy: "Mid" },
    { id: createId(), title: "Stay", artist: "Rihanna", energy: "Low" },
    { id: createId(), title: "Cake by the Ocean", artist: "DNCE", energy: "High" },
    { id: createId(), title: "You Make My Dreams", artist: "Hall & Oates", energy: "High" },
    { id: createId(), title: "The Story", artist: "Brandi Carlile", energy: "Mid" },
    { id: createId(), title: "Crazy", artist: "Gnarls Barkley", energy: "Mid" },
    { id: createId(), title: "September", artist: "Earth, Wind & Fire", energy: "High" },
    { id: createId(), title: "Black Horse and the Cherry Tree", artist: "KT Tunstall", energy: "Mid" },
    { id: createId(), title: "Love on the Brain", artist: "Rihanna", energy: "Low" },
    { id: createId(), title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", energy: "High" },
  ];

  const members: Member[] = [
    { id: createId(), name: "Maya", role: "Lead Vocals", allocation: 35 },
    { id: createId(), name: "Andre", role: "Lead Guitar", allocation: 22 },
    { id: createId(), name: "Riley", role: "Bass", allocation: 16 },
    { id: createId(), name: "Theo", role: "Drums", allocation: 15 },
    { id: createId(), name: "Jules", role: "Keys", allocation: 8 },
    { id: createId(), name: "Nia", role: "Sax / Percussion", allocation: 4 },
  ];

  const headlineShow: Show = {
    id: createId(),
    date: nextFriday(),
    venue: "The Copper Room",
    city: "Brooklyn, NY",
    notes: "Acoustic first set, full band second set",
    lineup: members.map((member) => member.id),
    setList: songs.slice(0, 9).map((song) => song.id),
  };

  const shows: Show[] = [
    headlineShow,
    {
      id: createId(),
      date: dateFromToday(-14),
      venue: "Harbor Light",
      city: "Jersey City, NJ",
      notes: "Private event load-in at 5pm",
      lineup: members.slice(0, 4).map((member) => member.id),
      setList: songs.slice(10, 18).map((song) => song.id),
    },
    {
      id: createId(),
      date: dateFromToday(-7),
      venue: "Juneberry Social",
      city: "Philadelphia, PA",
      notes: "Crowd skewed younger, keep second set upbeat",
      lineup: members.map((member) => member.id),
      setList: songs.slice(18, 27).map((song) => song.id),
    },
    {
      id: createId(),
      date: dateFromToday(6),
      venue: "The Mariner",
      city: "Asbury Park, NJ",
      notes: "Outdoor patio set with short break between sets",
      lineup: members.slice(0, 5).map((member) => member.id),
      setList: songs.slice(4, 13).map((song) => song.id),
    },
    {
      id: createId(),
      date: dateFromToday(13),
      venue: "Velvet Room",
      city: "New York, NY",
      notes: "Late-night room, lean funk and dance-heavy",
      lineup: [members[0].id, members[1].id, members[2].id, members[3].id, members[5].id],
      setList: songs.slice(24, 33).map((song) => song.id),
    },
    {
      id: createId(),
      date: dateFromToday(21),
      venue: "Sparrow Hall",
      city: "Hoboken, NJ",
      notes: "Venue wants a tighter first set and strong singalongs late",
      lineup: members.map((member) => member.id),
      setList: songs.slice(6, 15).map((song) => song.id),
    },
    {
      id: createId(),
      date: dateFromToday(30),
      venue: "Luna Lounge",
      city: "Boston, MA",
      notes: "Travel date, compact backline, no percussion riser",
      lineup: members.slice(0, 5).map((member) => member.id),
      setList: songs.slice(14, 23).map((song) => song.id),
    },
  ];

  return {
    bandName: "StageHand House Band",
    links: {
      merchStore: "https://shop.stagehand.example",
      showCalendar: "https://calendar.stagehand.example",
      venmo: "@stagehandband",
      cashapp: "$stagehandband",
      paypal: "paypal.me/stagehandband",
    },
    access: {
      managerPin: "2468",
      memberPin: "1357",
      crowdLabel: "Front-of-house tablet",
    },
    songs,
    members,
    shows,
    requests: [
      {
        id: createId(),
        songId: songs[1].id,
        requester: "Lex",
        note: "Birthday table request",
        tip: 20,
        upvotes: 3,
        createdAt: Date.now() - 1000 * 60 * 30,
      },
      {
        id: createId(),
        songId: songs[2].id,
        requester: "Chris",
        note: "Slow dance moment",
        tip: 12,
        upvotes: 1,
        createdAt: Date.now() - 1000 * 60 * 12,
      },
      {
        id: createId(),
        songId: songs[15].id,
        requester: "Mina",
        note: "For the rooftop crew",
        tip: 18,
        upvotes: 4,
        createdAt: Date.now() - 1000 * 60 * 28,
      },
      {
        id: createId(),
        songId: songs[24].id,
        requester: "Paul",
        note: "We all know the chorus",
        tip: 15,
        upvotes: 5,
        createdAt: Date.now() - 1000 * 60 * 26,
      },
      {
        id: createId(),
        songId: songs[33].id,
        requester: "Anika",
        note: "Dance floor is ready",
        tip: 25,
        upvotes: 6,
        createdAt: Date.now() - 1000 * 60 * 22,
      },
      {
        id: createId(),
        songId: songs[10].id,
        requester: "Drew",
        note: "Table 6 singalong request",
        tip: 9,
        upvotes: 2,
        createdAt: Date.now() - 1000 * 60 * 19,
      },
      {
        id: createId(),
        songId: songs[7].id,
        requester: "Tori",
        note: "",
        tip: 10,
        upvotes: 2,
        createdAt: Date.now() - 1000 * 60 * 16,
      },
      {
        id: createId(),
        songId: songs[21].id,
        requester: "Gabe",
        note: "Bridal party request",
        tip: 30,
        upvotes: 7,
        createdAt: Date.now() - 1000 * 60 * 11,
      },
      {
        id: createId(),
        songId: songs[28].id,
        requester: "Helena",
        note: "Would sound great acoustic",
        tip: 8,
        upvotes: 1,
        createdAt: Date.now() - 1000 * 60 * 9,
      },
      {
        id: createId(),
        songId: songs[31].id,
        requester: "Jon",
        note: "Play this into the break",
        tip: 14,
        upvotes: 3,
        createdAt: Date.now() - 1000 * 60 * 6,
      },
    ],
    supportTips: [
      {
        id: createId(),
        supporter: "Dana",
        amount: 25,
        note: "You sound incredible tonight",
        createdAt: Date.now() - 1000 * 60 * 15,
      },
      {
        id: createId(),
        supporter: "Bree",
        amount: 10,
        note: "For the sax solos",
        createdAt: Date.now() - 1000 * 60 * 24,
      },
      {
        id: createId(),
        supporter: "Marcus",
        amount: 40,
        note: "Thanks for learning our anniversary song",
        createdAt: Date.now() - 1000 * 60 * 18,
      },
      {
        id: createId(),
        supporter: "Olive",
        amount: 15,
        note: "Come back next month",
        createdAt: Date.now() - 1000 * 60 * 10,
      },
      {
        id: createId(),
        supporter: "Sofia",
        amount: 20,
        note: "The first set was perfect",
        createdAt: Date.now() - 1000 * 60 * 4,
      },
    ],
    activeShowId: headlineShow.id,
  };
};

export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "No show date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateString}T19:00:00`));
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const normalizeEnergy = (value: string): SongEnergy => {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("h")) {
    return "High";
  }
  if (normalized.startsWith("l")) {
    return "Low";
  }
  return "Mid";
};

export const formatLink = (label: string, value: string) => {
  if (value.startsWith("http")) {
    return value;
  }
  if (label === "Venmo") {
    return `https://venmo.com/${value.replace("@", "")}`;
  }
  if (label === "Cash App") {
    return `https://cash.app/${value.replace("$", "")}`;
  }
  if (label === "PayPal") {
    return value.startsWith("paypal.me") ? `https://${value}` : `https://paypal.me/${value}`;
  }
  return `https://${value}`;
};

export const mergeHydratedState = (
  seedState: StageHandState,
  parsed: Partial<StageHandState>,
): StageHandState => ({
  ...seedState,
  ...parsed,
  links: { ...seedState.links, ...(parsed.links || {}) },
  access: { ...seedState.access, ...(parsed.access || {}) },
  songs: parsed.songs?.length ? parsed.songs : seedState.songs,
  members: parsed.members?.length ? parsed.members : seedState.members,
  shows: parsed.shows?.length ? parsed.shows : seedState.shows,
  requests: parsed.requests || seedState.requests,
  supportTips: parsed.supportTips || seedState.supportTips,
  activeShowId: parsed.activeShowId || parsed.shows?.[0]?.id || seedState.activeShowId,
});

export const emptyLinks = (links: BandLinks) =>
  [
    { label: "Merch store", value: links.merchStore },
    { label: "Show calendar", value: links.showCalendar },
    { label: "Venmo", value: links.venmo },
    { label: "Cash App", value: links.cashapp },
    { label: "PayPal", value: links.paypal },
  ].filter((item) => item.value);
