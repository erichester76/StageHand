import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import {
  buildSeedState,
  createId,
  formatCurrency,
  formatDate,
  formatLink,
  mergeHydratedState,
  nextFriday,
  normalizeEnergy,
  STORAGE_KEY,
} from "../lib/stagehand";
import {
  AccessSettings,
  BandLinks,
  Member,
  RequestItem,
  Show,
  Song,
  StageHandState,
  SupportTip,
  Venue,
} from "../types/stagehand";

const seedState = buildSeedState();

export function useStageHandState() {
  const [state, setState] = useState<StageHandState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<StageHandState>;
          setState(mergeHydratedState(seedState, parsed));
        }
      } catch (error) {
        console.warn("Unable to hydrate StageHand state", error);
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const activeShow = state.shows.find((show) => show.id === state.activeShowId) || state.shows[0] || null;
  const requestTips = state.requests.reduce((sum, request) => sum + request.tip, 0);
  const supportTipTotal = state.supportTips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalTips = requestTips + supportTipTotal;
  const splitTotal = state.members.reduce((sum, member) => sum + member.allocation, 0);
  const sortedRequests = [...state.requests].sort((left, right) => {
    const leftScore = left.tip * 100 + left.upvotes;
    const rightScore = right.tip * 100 + right.upvotes;
    return rightScore - leftScore;
  });

  const songById = (songId: string) => state.songs.find((song) => song.id === songId);
  const memberById = (memberId: string) => state.members.find((member) => member.id === memberId);

  const replaceState = (updater: (current: StageHandState) => StageHandState) => {
    setState((current) => updater(current));
  };

  const actions = {
    addSong: (song: Omit<Song, "id">) => {
      replaceState((current) => ({
        ...current,
        songs: [{ id: createId(), ...song }, ...current.songs],
      }));
    },
    removeSong: (songId: string) => {
      replaceState((current) => ({
        ...current,
        songs: current.songs.filter((song) => song.id !== songId),
        requests: current.requests.filter((request) => request.songId !== songId),
        shows: current.shows.map((show) => ({
          ...show,
          setList: show.setList.filter((entry) => entry !== songId),
        })),
      }));
    },
    addMember: (member: Omit<Member, "id">) => {
      replaceState((current) => ({
        ...current,
        members: [...current.members, { id: createId(), ...member }],
      }));
    },
    removeMember: (memberId: string) => {
      replaceState((current) => ({
        ...current,
        members: current.members.filter((member) => member.id !== memberId),
        shows: current.shows.map((show) => ({
          ...show,
          lineup: show.lineup.filter((entry) => entry !== memberId),
        })),
      }));
    },
    addVenue: (venue: Omit<Venue, "id">) => {
      replaceState((current) => ({
        ...current,
        venues: [{ id: createId(), ...venue }, ...current.venues],
      }));
    },
    removeVenue: (venueId: string) => {
      replaceState((current) => {
        const removedVenue = current.venues.find((venue) => venue.id === venueId);
        const remainingVenues = current.venues.filter((venue) => venue.id !== venueId);
        const remainingShows = current.shows.filter((show) => show.venue !== removedVenue?.name);
        return {
          ...current,
          venues: remainingVenues,
          shows: remainingShows,
          activeShowId: remainingShows.find((show) => show.id === current.activeShowId)
            ? current.activeShowId
            : remainingShows[0]?.id || "",
        };
      });
    },
    updateMemberAllocation: (memberId: string, allocation: number) => {
      replaceState((current) => ({
        ...current,
        members: current.members.map((member) =>
          member.id === memberId ? { ...member, allocation } : member,
        ),
      }));
    },
    addShow: (show: Omit<Show, "id" | "lineup" | "setList">) => {
      const createdShow: Show = {
        id: createId(),
        lineup: [],
        setList: [],
        ...show,
      };

      replaceState((current) => ({
        ...current,
        shows: [createdShow, ...current.shows],
        activeShowId: createdShow.id,
      }));
    },
    removeShow: (showId: string) => {
      replaceState((current) => {
        const remainingShows = current.shows.filter((show) => show.id !== showId);
        if (remainingShows.length) {
          const nextActive =
            current.activeShowId === showId ? remainingShows[0].id : current.activeShowId;
          return {
            ...current,
            shows: remainingShows,
            activeShowId: nextActive,
          };
        }

        const fallback: Show = {
          id: createId(),
          date: nextFriday(),
          venue: "New Show",
          city: "TBD",
          notes: "",
          lineup: current.members.map((member) => member.id),
          setList: [],
        };

        return {
          ...current,
          shows: [fallback],
          activeShowId: fallback.id,
        };
      });
    },
    setActiveShow: (showId: string) => {
      replaceState((current) => ({ ...current, activeShowId: showId }));
    },
    toggleLineupMember: (memberId: string) => {
      replaceState((current) => ({
        ...current,
        shows: current.shows.map((show) => {
          if (show.id !== current.activeShowId) {
            return show;
          }
          return {
            ...show,
            lineup: show.lineup.includes(memberId)
              ? show.lineup.filter((entry) => entry !== memberId)
              : [...show.lineup, memberId],
          };
        }),
      }));
    },
    addSongToSetList: (songId: string) => {
      replaceState((current) => ({
        ...current,
        shows: current.shows.map((show) =>
          show.id === current.activeShowId
            ? { ...show, setList: [...show.setList, songId] }
            : show,
        ),
      }));
    },
    removeSongFromSetList: (songId: string) => {
      replaceState((current) => ({
        ...current,
        shows: current.shows.map((show) => {
          if (show.id !== current.activeShowId) {
            return show;
          }
          const index = show.setList.indexOf(songId);
          if (index < 0) {
            return show;
          }
          const nextSetList = [...show.setList];
          nextSetList.splice(index, 1);
          return { ...show, setList: nextSetList };
        }),
      }));
    },
    updateProfile: (profile: BandLinks & { bandName: string }) => {
      replaceState((current) => ({
        ...current,
        bandName: profile.bandName,
        links: {
          merchStore: profile.merchStore,
          showCalendar: profile.showCalendar,
          venmo: profile.venmo,
          cashapp: profile.cashapp,
          paypal: profile.paypal,
        },
      }));
    },
    updateAccess: (access: AccessSettings) => {
      replaceState((current) => ({
        ...current,
        access,
      }));
    },
    addRequest: (payload: {
      requester: string;
      songId: string;
      note: string;
      tip: number;
    }) => {
      replaceState((current) => ({
        ...current,
        requests: [
          ...current.requests,
          {
            id: createId(),
            requester: payload.requester,
            songId: payload.songId,
            note: payload.note,
            tip: payload.tip,
            upvotes: 1,
            createdAt: Date.now(),
          },
        ],
      }));
    },
    boostRequest: (requestId: string) => {
      replaceState((current) => ({
        ...current,
        requests: current.requests.map((request) =>
          request.id === requestId
            ? { ...request, tip: request.tip + 5, upvotes: request.upvotes + 1 }
            : request,
        ),
      }));
    },
    clearRequest: (requestId: string) => {
      replaceState((current) => ({
        ...current,
        requests: current.requests.filter((request) => request.id !== requestId),
      }));
    },
    addSupportTip: (payload: { supporter: string; amount: number; note: string }) => {
      replaceState((current) => ({
        ...current,
        supportTips: [
          {
            id: createId(),
            supporter: payload.supporter,
            amount: payload.amount,
            note: payload.note,
            createdAt: Date.now(),
          },
          ...current.supportTips,
        ],
      }));
    },
    resetDemoData: () => {
      replaceState(() => buildSeedState());
    },
  };

  return {
    state,
    hydrated,
    activeShow,
    totalTips,
    splitTotal,
    sortedRequests,
    helpers: {
      formatCurrency,
      formatDate,
      formatLink,
      normalizeEnergy,
      songById,
      memberById,
    },
    actions,
  };
}

export type StageHandModel = ReturnType<typeof useStageHandState>;
