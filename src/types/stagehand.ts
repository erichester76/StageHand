export type Role = "manager" | "member" | "crowd";
export type ProtectedRole = Exclude<Role, "crowd">;

export type DeviceSession = {
  role: Role;
  provisionedAt: number;
};

export type SongEnergy = "Low" | "Mid" | "High";

export type Song = {
  id: string;
  title: string;
  artist: string;
  energy: SongEnergy;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  allocation: number;
};

export type Show = {
  id: string;
  date: string;
  venue: string;
  city: string;
  notes: string;
  lineup: string[];
  setList: string[];
};

export type RequestItem = {
  id: string;
  songId: string;
  requester: string;
  note: string;
  tip: number;
  upvotes: number;
  createdAt: number;
};

export type SupportTip = {
  id: string;
  supporter: string;
  amount: number;
  note: string;
  createdAt: number;
};

export type BandLinks = {
  merchStore: string;
  showCalendar: string;
  venmo: string;
  cashapp: string;
  paypal: string;
};

export type AccessSettings = {
  managerPin: string;
  memberPin: string;
  crowdLabel: string;
};

export type StageHandState = {
  bandName: string;
  links: BandLinks;
  access: AccessSettings;
  songs: Song[];
  members: Member[];
  shows: Show[];
  requests: RequestItem[];
  supportTips: SupportTip[];
  activeShowId: string;
};
