import React from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import {
  EmptyState,
  GhostButton,
  MetricCard,
  PrimaryButton,
  SectionCard,
  TextInputField,
} from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { Member, RequestItem, Show, Song, StageHandState, Venue } from "../types/stagehand";

type ManagerHelpers = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  normalizeEnergy: (value: string) => Song["energy"];
  songById: (songId: string) => Song | undefined;
  memberById: (memberId: string) => Member | undefined;
};

type ManagerActions = {
  updateProfile: (profile: {
    bandName: string;
    merchStore: string;
    showCalendar: string;
    venmo: string;
    cashapp: string;
    paypal: string;
  }) => void;
  updateAccess: (access: { managerPin: string; memberPin: string; crowdLabel: string }) => void;
  addSong: (song: Omit<Song, "id">) => void;
  updateSong: (songId: string, updates: Omit<Song, "id">) => void;
  removeSong: (songId: string) => void;
  addMember: (member: Omit<Member, "id">) => void;
  updateMember: (memberId: string, updates: Omit<Member, "id">) => void;
  removeMember: (memberId: string) => void;
  addVenue: (venue: Omit<Venue, "id">) => void;
  updateVenue: (venueId: string, updates: Omit<Venue, "id">) => void;
  removeVenue: (venueId: string) => void;
  addShow: (show: Omit<Show, "id" | "lineup" | "setList">) => void;
  updateShow: (showId: string, updates: Omit<Show, "id" | "lineup" | "setList">) => void;
  removeShow: (showId: string) => void;
  setActiveShow: (showId: string) => void;
  toggleLineupMember: (memberId: string) => void;
  addSongToSetList: (songId: string) => void;
  removeSongFromSetList: (songId: string) => void;
  boostRequest: (requestId: string) => void;
  clearRequest: (requestId: string) => void;
  resetDemoData: () => void;
};

type ManagerMode = "active-show" | "planning";
type ActivePanel = "queue" | "set" | "tonight";
type PlanningPanel = "shows" | "venues" | "catalog" | "band" | "settings";

function CompactListRow({
  title,
  selected,
  onPress,
  aside,
  last,
}: {
  title: string;
  selected?: boolean;
  onPress?: () => void;
  aside?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.compactListRow,
        selected && styles.compactListRowActive,
        last && styles.compactListRowLast,
      ]}
    >
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      {aside ? <View style={styles.actionRow}>{aside}</View> : null}
    </Pressable>
  );
}

export function ManagerView({
  activeShow,
  helpers,
  splitTotal,
  sortedRequests,
  state,
  totalTips,
  actions,
}: {
  activeShow: Show | null;
  helpers: ManagerHelpers;
  splitTotal: number;
  sortedRequests: RequestItem[];
  state: StageHandState;
  totalTips: number;
  actions: ManagerActions;
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const [mode, setMode] = React.useState<ManagerMode>("active-show");
  const [activePanel, setActivePanel] = React.useState<ActivePanel>("queue");
  const [planningPanel, setPlanningPanel] = React.useState<PlanningPanel>("shows");

  const [selectedShowId, setSelectedShowId] = React.useState<string | null>(null);
  const [selectedSongId, setSelectedSongId] = React.useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);

  const [songTitle, setSongTitle] = React.useState("");
  const [songArtist, setSongArtist] = React.useState("");
  const [songEnergy, setSongEnergy] = React.useState<Song["energy"]>("Mid");
  const [songKey, setSongKey] = React.useState("");
  const [songLyricsLink, setSongLyricsLink] = React.useState("");

  const [showDate, setShowDate] = React.useState("");
  const [showVenue, setShowVenue] = React.useState("");
  const [showCity, setShowCity] = React.useState("");
  const [showNotes, setShowNotes] = React.useState("");

  const [memberName, setMemberName] = React.useState("");
  const [memberRole, setMemberRole] = React.useState("");
  const [memberAllocation, setMemberAllocation] = React.useState("20");

  const [venueName, setVenueName] = React.useState("");
  const [venueAddress, setVenueAddress] = React.useState("");
  const [venueContact, setVenueContact] = React.useState("");
  const [venueNotes, setVenueNotes] = React.useState("");

  const [bandName, setBandName] = React.useState(state.bandName);
  const [merchStore, setMerchStore] = React.useState(state.links.merchStore);
  const [showCalendar, setShowCalendar] = React.useState(state.links.showCalendar);
  const [venmo, setVenmo] = React.useState(state.links.venmo);
  const [cashapp, setCashapp] = React.useState(state.links.cashapp);
  const [paypal, setPaypal] = React.useState(state.links.paypal);
  const [managerPin, setManagerPin] = React.useState(state.access.managerPin);
  const [memberPin, setMemberPin] = React.useState(state.access.memberPin);
  const [crowdLabel, setCrowdLabel] = React.useState(state.access.crowdLabel);

  React.useEffect(() => {
    setBandName(state.bandName);
    setMerchStore(state.links.merchStore);
    setShowCalendar(state.links.showCalendar);
    setVenmo(state.links.venmo);
    setCashapp(state.links.cashapp);
    setPaypal(state.links.paypal);
  }, [state.bandName, state.links]);

  React.useEffect(() => {
    setManagerPin(state.access.managerPin);
    setMemberPin(state.access.memberPin);
    setCrowdLabel(state.access.crowdLabel);
  }, [state.access]);

  const selectedShow = state.shows.find((show) => show.id === selectedShowId) || null;
  const selectedSong = state.songs.find((song) => song.id === selectedSongId) || null;
  const selectedVenue = state.venues.find((venue) => venue.id === selectedVenueId) || null;
  const selectedMember = state.members.find((member) => member.id === selectedMemberId) || null;

  React.useEffect(() => {
    if (!selectedShow) {
      return;
    }
    setShowDate(selectedShow.date);
    setShowVenue(selectedShow.venue);
    setShowCity(selectedShow.city);
    setShowNotes(selectedShow.notes);
  }, [selectedShow]);

  React.useEffect(() => {
    if (!selectedSong) {
      return;
    }
    setSongTitle(selectedSong.title);
    setSongArtist(selectedSong.artist);
    setSongEnergy(selectedSong.energy);
    setSongKey(selectedSong.key);
    setSongLyricsLink(selectedSong.lyricsLink);
  }, [selectedSong]);

  React.useEffect(() => {
    if (!selectedVenue) {
      return;
    }
    setVenueName(selectedVenue.name);
    setVenueAddress(selectedVenue.address);
    setVenueContact(selectedVenue.contact);
    setVenueNotes(selectedVenue.notes);
  }, [selectedVenue]);

  React.useEffect(() => {
    if (!selectedMember) {
      return;
    }
    setMemberName(selectedMember.name);
    setMemberRole(selectedMember.role);
    setMemberAllocation(`${selectedMember.allocation}`);
  }, [selectedMember]);

  const activeSetSongs = activeShow
    ? activeShow.setList
        .map((songId, index) => {
          const song = helpers.songById(songId);
          return song ? { song, index } : null;
        })
        .filter((entry): entry is { song: Song; index: number } => Boolean(entry))
    : [];

  const lineupMembers = activeShow
    ? activeShow.lineup
        .map((memberId) => helpers.memberById(memberId))
        .filter((member): member is Member => Boolean(member))
    : [];

  const requestTipTotal = sortedRequests.reduce((sum, request) => sum + request.tip, 0);
  const supportTipTotal = totalTips - requestTipTotal;
  const topRequests = sortedRequests.slice(0, 10);
  const quickAddSongs = state.songs.slice(0, 12);

  const resetShowForm = () => {
    setSelectedShowId(null);
    setShowDate("");
    setShowVenue("");
    setShowCity("");
    setShowNotes("");
  };

  const resetSongForm = () => {
    setSelectedSongId(null);
    setSongTitle("");
    setSongArtist("");
    setSongEnergy("Mid");
    setSongKey("");
    setSongLyricsLink("");
  };

  const resetVenueForm = () => {
    setSelectedVenueId(null);
    setVenueName("");
    setVenueAddress("");
    setVenueContact("");
    setVenueNotes("");
  };

  const resetMemberForm = () => {
    setSelectedMemberId(null);
    setMemberName("");
    setMemberRole("");
    setMemberAllocation("20");
  };

  const secondaryTabs =
    mode === "active-show"
      ? ([
          ["queue", "Queue"],
          ["set", "Set"],
          ["tonight", "Tonight"],
        ] as [ActivePanel, string][])
      : ([
          ["shows", "Shows"],
          ["venues", "Venues"],
          ["catalog", "Catalog"],
          ["band", "Band"],
          ["settings", "Settings"],
        ] as [PlanningPanel, string][]);

  const secondarySelection = mode === "active-show" ? activePanel : planningPanel;
  const toolbarMeta =
    mode === "active-show"
      ? activeShow
        ? `${activeShow.venue} · ${helpers.formatDate(activeShow.date)}`
        : "Select or create a show in Planning to run the room."
      : activeShow
        ? `Planning for ${activeShow.venue} · ${activeShow.city}`
        : "Planning workspace ready for shows, venues, catalog, band, and settings.";

  return (
    <View style={styles.sectionStack}>
      <View style={styles.toolbarShell}>
        <View style={styles.toolbarRow}>
          {([
            ["active-show", "Active Show"],
            ["planning", "Planning / Pre-Show"],
          ] as [ManagerMode, string][]).map(([value, label]) => {
            const selected = mode === value;
            return (
              <Pressable
                key={value}
                onPress={() => setMode(value)}
                style={[styles.toolbarPill, selected && styles.toolbarPillActive]}
              >
                <Text style={[styles.toolbarPillText, selected && styles.toolbarPillTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.toolbarRow}>
          {secondaryTabs.map(([value, label]) => {
            const selected = secondarySelection === value;
            return (
              <Pressable
                key={value}
                onPress={() =>
                  mode === "active-show"
                    ? setActivePanel(value as ActivePanel)
                    : setPlanningPanel(value as PlanningPanel)
                }
                style={[styles.toolbarPill, selected && styles.toolbarPillActive]}
              >
                <Text style={[styles.toolbarPillText, selected && styles.toolbarPillTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.toolbarMeta}>{toolbarMeta}</Text>
      </View>

      {mode === "active-show" && activePanel === "queue" ? (
        <SectionCard
          title="Request queue"
          eyebrow={topRequests.length ? `${sortedRequests.length} requests waiting` : "No requests waiting"}
        >
          <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
            <MetricCard label="Live requests" value={`${sortedRequests.length}`} detail="Highest-priority first" />
            <MetricCard label="Request tips" value={helpers.formatCurrency(requestTipTotal)} detail="Crowd demand right now" />
          </View>
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {topRequests.length ? (
                topRequests.map((request, index) => {
                  const song = helpers.songById(request.songId);
                  if (!song) {
                    return null;
                  }
                  return (
                    <CompactListRow
                      key={request.id}
                      title={song.title}
                      last={index === topRequests.length - 1}
                      aside={
                        <>
                          <GhostButton label="Boost" onPress={() => actions.boostRequest(request.id)} />
                          <GhostButton label="Clear" onPress={() => actions.clearRequest(request.id)} />
                        </>
                      }
                    />
                  );
                })
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="The room is clear right now. New requests will land here." />
                </View>
              )}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "active-show" && activePanel === "set" ? (
        <SectionCard
          title="Running set"
          eyebrow={activeShow ? `${activeSetSongs.length} songs staged for ${activeShow.venue}` : "No active show selected"}
        >
          <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
            <MetricCard
              label="Set size"
              value={`${activeSetSongs.length}`}
              detail={activeSetSongs[0] ? `Next up: ${activeSetSongs[0].song.title}` : "No next song staged"}
            />
            <MetricCard label="Quick add" value={`${quickAddSongs.length}`} detail="Top catalog shortcuts below" />
          </View>
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {activeSetSongs.length ? (
                activeSetSongs.map(({ song, index }) => (
                  <CompactListRow
                    key={`${song.id}-${index}`}
                    title={`${index + 1}. ${song.title}`}
                    last={index === activeSetSongs.length - 1}
                    aside={<GhostButton label="Remove" onPress={() => actions.removeSongFromSetList(song.id)} />}
                  />
                ))
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="No songs are staged for the current set yet." />
                </View>
              )}
            </View>
          </ScrollView>
          <Text style={styles.fieldLabel}>Quick add from catalog</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillWrap}>
              {quickAddSongs.map((song) => (
                <Pressable
                  key={song.id}
                  onPress={() => actions.addSongToSetList(song.id)}
                  style={styles.selectPill}
                >
                  <Text style={styles.selectPillText}>{song.title}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "active-show" && activePanel === "tonight" ? (
        <SectionCard
          title="Tonight"
          eyebrow={activeShow ? `${activeShow.venue} · ${activeShow.city}` : "No active show selected"}
        >
          <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
            <MetricCard
              label="Tips"
              value={helpers.formatCurrency(totalTips)}
              detail={`${helpers.formatCurrency(requestTipTotal)} requests · ${helpers.formatCurrency(supportTipTotal)} support`}
            />
            <MetricCard label="Lineup" value={`${lineupMembers.length}`} detail="Players assigned to this show" />
            <MetricCard label="Support tips" value={helpers.formatCurrency(supportTipTotal)} detail="Direct support during the show" />
          </View>
          <View style={styles.compactList}>
            {lineupMembers.length ? (
              lineupMembers.map((member, index) => (
                <CompactListRow
                  key={member.id}
                  title={member.name}
                  last={index === lineupMembers.length - 1}
                />
              ))
            ) : (
              <View style={styles.compactListRowLast}>
                <EmptyState label="Assign a lineup in Planning first." />
              </View>
            )}
          </View>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "shows" ? (
        <SectionCard title="Shows" eyebrow={`${state.shows.length} shows in rotation`}>
          <GhostButton label="New show" onPress={resetShowForm} />
          <TextInputField label="Show date" value={showDate} onChangeText={setShowDate} />
          <TextInputField label="Venue" value={showVenue} onChangeText={setShowVenue} />
          <TextInputField label="City" value={showCity} onChangeText={setShowCity} />
          <TextInputField label="Notes" value={showNotes} onChangeText={setShowNotes} />
          <PrimaryButton
            label={selectedShowId ? "Save show" : "Add show"}
            onPress={() => {
              if (!showDate.trim() || !showVenue.trim() || !showCity.trim()) {
                return;
              }
              const payload = {
                date: showDate.trim(),
                venue: showVenue.trim(),
                city: showCity.trim(),
                notes: showNotes.trim(),
              };
              if (selectedShowId) {
                actions.updateShow(selectedShowId, payload);
              } else {
                actions.addShow(payload);
              }
            }}
          />
          {selectedShowId ? (
            <GhostButton
              label="Delete show"
              onPress={() => {
                actions.removeShow(selectedShowId);
                resetShowForm();
              }}
            />
          ) : null}
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {state.shows.map((show, index) => (
                <CompactListRow
                  key={show.id}
                  title={show.venue}
                  selected={selectedShowId === show.id}
                  onPress={() => {
                    setSelectedShowId(show.id);
                    actions.setActiveShow(show.id);
                  }}
                  last={index === state.shows.length - 1}
                />
              ))}
            </View>
          </ScrollView>
          <Text style={styles.fieldLabel}>Selected show lineup</Text>
          <View style={styles.pillWrap}>
            {state.members.map((member) => {
              const selected = activeShow?.lineup.includes(member.id) ?? false;
              return (
                <Pressable
                  key={member.id}
                  onPress={() => actions.toggleLineupMember(member.id)}
                  style={[styles.togglePill, selected && styles.togglePillActive]}
                >
                  <Text style={[styles.togglePillText, selected && styles.togglePillTextActive]}>
                    {member.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.fieldLabel}>Selected show setlist</Text>
          <ScrollView style={styles.embeddedScrollArea}>
            <View style={styles.compactList}>
              {activeSetSongs.length ? (
                activeSetSongs.map(({ song, index }) => (
                  <CompactListRow
                    key={`${song.id}-${index}`}
                    title={song.title}
                    last={index === activeSetSongs.length - 1}
                    aside={<GhostButton label="Remove" onPress={() => actions.removeSongFromSetList(song.id)} />}
                  />
                ))
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="No songs staged for the selected show yet." />
                </View>
              )}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "venues" ? (
        <SectionCard title="Venues" eyebrow={`${state.venues.length} saved venues`}>
          <GhostButton label="New venue" onPress={resetVenueForm} />
          <TextInputField label="Venue name" value={venueName} onChangeText={setVenueName} />
          <TextInputField label="Address" value={venueAddress} onChangeText={setVenueAddress} />
          <TextInputField label="Contact" value={venueContact} onChangeText={setVenueContact} />
          <TextInputField label="Venue notes" value={venueNotes} onChangeText={setVenueNotes} />
          <PrimaryButton
            label={selectedVenueId ? "Save venue" : "Add venue"}
            onPress={() => {
              if (!venueName.trim() || !venueAddress.trim()) {
                return;
              }
              const payload = {
                name: venueName.trim(),
                address: venueAddress.trim(),
                contact: venueContact.trim(),
                notes: venueNotes.trim(),
              };
              if (selectedVenueId) {
                actions.updateVenue(selectedVenueId, payload);
              } else {
                actions.addVenue(payload);
              }
            }}
          />
          {selectedVenueId ? (
            <GhostButton
              label="Delete venue"
              onPress={() => {
                actions.removeVenue(selectedVenueId);
                resetVenueForm();
              }}
            />
          ) : null}
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {state.venues.map((venue, index) => (
                <CompactListRow
                  key={venue.id}
                  title={venue.name}
                  selected={selectedVenueId === venue.id}
                  onPress={() => setSelectedVenueId(venue.id)}
                  last={index === state.venues.length - 1}
                />
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "catalog" ? (
        <SectionCard title="Song catalog" eyebrow={`${state.songs.length} songs available`}>
          <GhostButton label="New song" onPress={resetSongForm} />
          <TextInputField label="Song title" value={songTitle} onChangeText={setSongTitle} />
          <TextInputField label="Artist" value={songArtist} onChangeText={setSongArtist} />
          <TextInputField label="In key of" value={songKey} onChangeText={setSongKey} />
          <TextInputField label="Lyrics link" value={songLyricsLink} onChangeText={setSongLyricsLink} />
          <Text style={styles.fieldLabel}>Energy</Text>
          <View style={styles.pillWrap}>
            {(["Low", "Mid", "High"] as Song["energy"][]).map((energy) => {
              const selected = songEnergy === energy;
              return (
                <Pressable
                  key={energy}
                  onPress={() => setSongEnergy(energy)}
                  style={[styles.selectPill, selected && styles.selectPillActive]}
                >
                  <Text style={[styles.selectPillText, selected && styles.selectPillTextActive]}>
                    {energy}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton
            label={selectedSongId ? "Save song" : "Add song"}
            onPress={() => {
              if (!songTitle.trim() || !songArtist.trim()) {
                return;
              }
              const payload = {
                title: songTitle.trim(),
                artist: songArtist.trim(),
                energy: helpers.normalizeEnergy(songEnergy),
                key: songKey.trim(),
                lyricsLink: songLyricsLink.trim(),
              };
              if (selectedSongId) {
                actions.updateSong(selectedSongId, payload);
              } else {
                actions.addSong(payload);
              }
            }}
          />
          {selectedSongId ? (
            <GhostButton
              label="Delete song"
              onPress={() => {
                actions.removeSong(selectedSongId);
                resetSongForm();
              }}
            />
          ) : null}
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {state.songs.map((song, index) => (
                <CompactListRow
                  key={song.id}
                  title={song.title}
                  selected={selectedSongId === song.id}
                  onPress={() => setSelectedSongId(song.id)}
                  last={index === state.songs.length - 1}
                />
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "band" ? (
        <SectionCard
          title="Band + payouts"
          eyebrow={`${splitTotal}% total split configured`}
          sideLabel={splitTotal === 100 ? "Balanced" : "Needs review"}
          sideTone={splitTotal === 100 ? "good" : "warning"}
        >
          <GhostButton label="New member" onPress={resetMemberForm} />
          <TextInputField label="Member name" value={memberName} onChangeText={setMemberName} />
          <TextInputField label="Role" value={memberRole} onChangeText={setMemberRole} />
          <TextInputField
            label="Split %"
            value={memberAllocation}
            keyboardType="numeric"
            onChangeText={setMemberAllocation}
          />
          <PrimaryButton
            label={selectedMemberId ? "Save member" : "Add member"}
            onPress={() => {
              if (!memberName.trim() || !memberRole.trim()) {
                return;
              }
              const payload = {
                name: memberName.trim(),
                role: memberRole.trim(),
                allocation: Number(memberAllocation) || 0,
              };
              if (selectedMemberId) {
                actions.updateMember(selectedMemberId, payload);
              } else {
                actions.addMember(payload);
              }
            }}
          />
          {selectedMemberId ? (
            <GhostButton
              label="Delete member"
              onPress={() => {
                actions.removeMember(selectedMemberId);
                resetMemberForm();
              }}
            />
          ) : null}
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {state.members.map((member, index) => (
                <CompactListRow
                  key={member.id}
                  title={member.name}
                  selected={selectedMemberId === member.id}
                  onPress={() => setSelectedMemberId(member.id)}
                  last={index === state.members.length - 1}
                />
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "settings" ? (
        <SectionCard
          title="Band links + device access"
          eyebrow="Shared manager-owned configuration"
        >
          <TextInputField label="Band name" value={bandName} onChangeText={setBandName} />
          <TextInputField label="Merch store" value={merchStore} onChangeText={setMerchStore} />
          <TextInputField label="Show calendar" value={showCalendar} onChangeText={setShowCalendar} />
          <TextInputField label="Venmo" value={venmo} onChangeText={setVenmo} />
          <TextInputField label="Cash App" value={cashapp} onChangeText={setCashapp} />
          <TextInputField label="PayPal" value={paypal} onChangeText={setPaypal} />
          <PrimaryButton
            label="Save band links"
            onPress={() =>
              actions.updateProfile({
                bandName: bandName.trim() || state.bandName,
                merchStore: merchStore.trim(),
                showCalendar: showCalendar.trim(),
                venmo: venmo.trim(),
                cashapp: cashapp.trim(),
                paypal: paypal.trim(),
              })
            }
          />
          <TextInputField label="Manager PIN" value={managerPin} onChangeText={setManagerPin} />
          <TextInputField label="Member PIN" value={memberPin} onChangeText={setMemberPin} />
          <TextInputField label="Crowd label" value={crowdLabel} onChangeText={setCrowdLabel} />
          <PrimaryButton
            label="Save device access"
            onPress={() =>
              actions.updateAccess({
                managerPin: managerPin.trim(),
                memberPin: memberPin.trim(),
                crowdLabel: crowdLabel.trim(),
              })
            }
          />
          <GhostButton label="Reload demo data" onPress={actions.resetDemoData} />
        </SectionCard>
      ) : null}
    </View>
  );
}
