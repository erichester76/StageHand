import React from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import {
  EmptyState,
  GhostButton,
  MetricCard,
  PrimaryButton,
  RowCard,
  SectionCard,
  TextInputField,
} from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { Member, RequestItem, Show, Song, StageHandState } from "../types/stagehand";

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
  removeSong: (songId: string) => void;
  addMember: (member: Omit<Member, "id">) => void;
  removeMember: (memberId: string) => void;
  updateMemberAllocation: (memberId: string, allocation: number) => void;
  addShow: (show: Omit<Show, "id" | "lineup" | "setList">) => void;
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
type PlanningPanel = "shows" | "catalog" | "band" | "settings";

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

  const [songTitle, setSongTitle] = React.useState("");
  const [songArtist, setSongArtist] = React.useState("");
  const [songEnergy, setSongEnergy] = React.useState<Song["energy"]>("Mid");

  const [showDate, setShowDate] = React.useState(activeShow?.date || "");
  const [showVenue, setShowVenue] = React.useState("");
  const [showCity, setShowCity] = React.useState("");
  const [showNotes, setShowNotes] = React.useState("");

  const [memberName, setMemberName] = React.useState("");
  const [memberRole, setMemberRole] = React.useState("");
  const [memberAllocation, setMemberAllocation] = React.useState("20");

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

  React.useEffect(() => {
    setShowDate(activeShow?.date || "");
  }, [activeShow?.date]);

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

  const secondaryTabs =
    mode === "active-show"
      ? ([
          ["queue", "Queue"],
          ["set", "Set"],
          ["tonight", "Tonight"],
        ] as [ActivePanel, string][])
      : ([
          ["shows", "Shows"],
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
        : "Planning workspace ready for shows, catalog, band, and settings.";

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
            <MetricCard
              label="Live requests"
              value={`${sortedRequests.length}`}
              detail="Highest-priority requests first"
            />
            <MetricCard
              label="Request tips"
              value={helpers.formatCurrency(requestTipTotal)}
              detail="Crowd-driven demand right now"
            />
          </View>
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.stackGap}>
              {topRequests.length ? (
                topRequests.map((request) => {
                  const song = helpers.songById(request.songId);
                  if (!song) {
                    return null;
                  }
                  return (
                    <View key={request.id} style={styles.rowCard}>
                      <View style={styles.rowMeta}>
                        <Text style={styles.rowTitle}>{song.title}</Text>
                        <Text style={styles.rowSubtitle}>
                          {request.requester} · {helpers.formatCurrency(request.tip)} · {request.upvotes} boosts
                        </Text>
                        {request.note ? <Text style={styles.compactNote}>{request.note}</Text> : null}
                      </View>
                      <View style={styles.actionRow}>
                        <GhostButton label="Boost" onPress={() => actions.boostRequest(request.id)} />
                        <GhostButton label="Clear" onPress={() => actions.clearRequest(request.id)} />
                      </View>
                    </View>
                  );
                })
              ) : (
                <EmptyState label="The room is clear right now. New requests will land here." />
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
            <MetricCard
              label="Quick add"
              value={`${quickAddSongs.length}`}
              detail="Top catalog shortcuts available below"
            />
          </View>
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.stackGap}>
              {activeSetSongs.length ? (
                activeSetSongs.map(({ song, index }) => (
                  <RowCard
                    key={`${song.id}-${index}`}
                    title={`${index + 1}. ${song.title}`}
                    subtitle={`${song.artist} · ${song.energy} energy`}
                    aside={<GhostButton label="Remove" onPress={() => actions.removeSongFromSetList(song.id)} />}
                  />
                ))
              ) : (
                <EmptyState label="No songs are staged for the current set yet." />
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
            <MetricCard
              label="Lineup"
              value={`${lineupMembers.length}`}
              detail="Players assigned to this show"
            />
            <MetricCard
              label="Support tips"
              value={helpers.formatCurrency(supportTipTotal)}
              detail="Direct support during the show"
            />
          </View>
          <Text style={styles.fieldLabel}>Lineup</Text>
          <View style={styles.pillWrap}>
            {lineupMembers.length ? (
              lineupMembers.map((member) => (
                <View key={member.id} style={styles.personPill}>
                  <Text style={styles.personPillTitle}>{member.name}</Text>
                  <Text style={styles.personPillSubtitle}>
                    {member.role} · {member.allocation}% split
                  </Text>
                </View>
              ))
            ) : (
              <EmptyState label="Assign a lineup in Planning first." />
            )}
          </View>
          <Text style={styles.fieldLabel}>Payout snapshot</Text>
          <ScrollView style={styles.embeddedScrollArea}>
            <View style={styles.stackGap}>
              {state.members.map((member) => (
                <RowCard
                  key={member.id}
                  title={member.name}
                  subtitle={`${member.role} · ${member.allocation}% share`}
                  aside={
                    <Text style={styles.moneyText}>
                      {helpers.formatCurrency(totalTips * (member.allocation / 100))}
                    </Text>
                  }
                />
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "shows" ? (
        <SectionCard
          title="Shows"
          eyebrow={`${state.shows.length} shows in rotation`}
        >
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.stackGap}>
              {state.shows.map((show) => (
                <RowCard
                  key={show.id}
                  title={`${show.venue} · ${show.city}`}
                  subtitle={`${helpers.formatDate(show.date)} · ${show.notes || "No notes yet"}`}
                  aside={
                    <>
                      <GhostButton label="Open" onPress={() => actions.setActiveShow(show.id)} />
                      {state.shows.length > 1 ? (
                        <GhostButton label="Remove" onPress={() => actions.removeShow(show.id)} />
                      ) : null}
                    </>
                  }
                />
              ))}
            </View>
          </ScrollView>
          <TextInputField label="Show date" value={showDate} onChangeText={setShowDate} />
          <TextInputField label="Venue" value={showVenue} onChangeText={setShowVenue} />
          <TextInputField label="City" value={showCity} onChangeText={setShowCity} />
          <TextInputField label="Notes" value={showNotes} onChangeText={setShowNotes} />
          <PrimaryButton
            label="Add show"
            onPress={() => {
              if (!showDate.trim() || !showVenue.trim() || !showCity.trim()) {
                return;
              }
              actions.addShow({
                date: showDate.trim(),
                venue: showVenue.trim(),
                city: showCity.trim(),
                notes: showNotes.trim(),
              });
              setShowVenue("");
              setShowCity("");
              setShowNotes("");
            }}
          />
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
          <Text style={styles.fieldLabel}>Prepared setlist</Text>
          <ScrollView style={styles.embeddedScrollArea}>
            <View style={styles.stackGap}>
              {activeSetSongs.length ? (
                activeSetSongs.map(({ song, index }) => (
                  <RowCard
                    key={`${song.id}-${index}-planning`}
                    title={`${index + 1}. ${song.title}`}
                    subtitle={`${song.artist} · ${song.energy} energy`}
                    aside={<GhostButton label="Remove" onPress={() => actions.removeSongFromSetList(song.id)} />}
                  />
                ))
              ) : (
                <EmptyState label="No songs staged for the selected show yet." />
              )}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}

      {mode === "planning" && planningPanel === "catalog" ? (
        <SectionCard
          title="Song catalog"
          eyebrow={`${state.songs.length} songs available for requests and sets`}
        >
          <TextInputField label="Song title" value={songTitle} onChangeText={setSongTitle} />
          <TextInputField label="Artist" value={songArtist} onChangeText={setSongArtist} />
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
            label="Add song"
            onPress={() => {
              if (!songTitle.trim() || !songArtist.trim()) {
                return;
              }
              actions.addSong({
                title: songTitle.trim(),
                artist: songArtist.trim(),
                energy: helpers.normalizeEnergy(songEnergy),
              });
              setSongTitle("");
              setSongArtist("");
              setSongEnergy("Mid");
            }}
          />
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.stackGap}>
              {state.songs.map((song) => (
                <RowCard
                  key={song.id}
                  title={song.title}
                  subtitle={`${song.artist} · ${song.energy} energy`}
                  aside={<GhostButton label="Remove" onPress={() => actions.removeSong(song.id)} />}
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
          <TextInputField label="Member name" value={memberName} onChangeText={setMemberName} />
          <TextInputField label="Role" value={memberRole} onChangeText={setMemberRole} />
          <TextInputField
            label="Split %"
            value={memberAllocation}
            keyboardType="numeric"
            onChangeText={setMemberAllocation}
          />
          <PrimaryButton
            label="Add member"
            onPress={() => {
              if (!memberName.trim() || !memberRole.trim()) {
                return;
              }
              actions.addMember({
                name: memberName.trim(),
                role: memberRole.trim(),
                allocation: Number(memberAllocation) || 0,
              });
              setMemberName("");
              setMemberRole("");
              setMemberAllocation("20");
            }}
          />
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.stackGap}>
              {state.members.map((member) => (
                <View key={member.id} style={styles.rowCard}>
                  <View style={styles.rowMeta}>
                    <Text style={styles.rowTitle}>{member.name}</Text>
                    <Text style={styles.rowSubtitle}>{member.role}</Text>
                  </View>
                  <TextInputField
                    label="Split %"
                    value={`${member.allocation}`}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      actions.updateMemberAllocation(member.id, Number(value) || 0)
                    }
                  />
                  <View style={styles.actionRow}>
                    <GhostButton label="Remove" onPress={() => actions.removeMember(member.id)} />
                    <Text style={styles.moneyText}>
                      {helpers.formatCurrency(totalTips * (member.allocation / 100))}
                    </Text>
                  </View>
                </View>
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
