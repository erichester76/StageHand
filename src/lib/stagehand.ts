import { BandLinks, Member, Show, Song, SongEnergy, StageHandState } from "../types/stagehand";

export const STORAGE_KEY = "stagehand-mobile-state-v1";

export const createId = () => Math.random().toString(36).slice(2, 10);

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
  ];

  const members: Member[] = [
    { id: createId(), name: "Maya", role: "Lead Vocals", allocation: 35 },
    { id: createId(), name: "Andre", role: "Guitar", allocation: 25 },
    { id: createId(), name: "Riley", role: "Bass", allocation: 20 },
    { id: createId(), name: "Theo", role: "Drums", allocation: 20 },
  ];

  const headlineShow: Show = {
    id: createId(),
    date: nextFriday(),
    venue: "The Copper Room",
    city: "Brooklyn, NY",
    notes: "Acoustic first set, full band second set",
    lineup: members.map((member) => member.id),
    setList: songs.slice(0, 4).map((song) => song.id),
  };

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
    shows: [headlineShow],
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
    ],
    supportTips: [
      {
        id: createId(),
        supporter: "Dana",
        amount: 25,
        note: "You sound incredible tonight",
        createdAt: Date.now() - 1000 * 60 * 15,
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
