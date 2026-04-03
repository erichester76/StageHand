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
};

type ManagerMode = "active-show" | "planning";
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
  const topRequests = sortedRequests.slice(0, 5);
  const quickAddSongs = state.songs.slice(0, 8);

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Manager mode</Text>
          <Text style={styles.sectionTitle}>Band manager workspace</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Active Show is now a fast live console. Planning / Pre-Show is a calmer workspace with
          focused sections for bigger setup tasks.
        </Text>
      </View>

      <SectionCard
        title={mode === "active-show" ? "Active Show" : "Planning / Pre-Show"}
        eyebrow={activeShow ? `${helpers.formatDate(activeShow.date)} · ${activeShow.venue}` : "No active show"}
        sideLabel={mode === "active-show" ? "Live desk" : "Prep mode"}
        sideTone={mode === "active-show" ? "good" : "warning"}
      >
        <View style={styles.tabRow}>
          {([
            ["active-show", "Active Show"],
            ["planning", "Planning / Pre-Show"],
          ] as [ManagerMode, string][]).map(([value, label]) => {
            const selected = mode === value;
            return (
              <Pressable
                key={value}
                onPress={() => setMode(value)}
                style={[styles.tabPill, selected && styles.tabPillActive]}
              >
                <Text style={[styles.tabPillText, selected && styles.tabPillTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.compactNote}>
          {mode === "active-show"
            ? "Run the room from here: queue, set flow, and tips."
            : "Prep here without the noise of live-show controls."}
        </Text>
      </SectionCard>

      {mode === "active-show" ? (
        <View style={styles.sectionStack}>
          <SectionCard
            title={activeShow?.venue || "No active show selected"}
            eyebrow={activeShow ? `${helpers.formatDate(activeShow.date)} · ${activeShow.city}` : "Show activation needed"}
          >
            <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
              <MetricCard
                label="Requests"
                value={`${sortedRequests.length}`}
                detail={topRequests.length ? "Top requests are ready to work" : "Queue is quiet"}
              />
              <MetricCard
                label="Set"
                value={`${activeSetSongs.length} songs`}
                detail={activeSetSongs[0] ? `Next up: ${activeSetSongs[0].song.title}` : "No set staged yet"}
              />
              <MetricCard
                label="Tips"
                value={helpers.formatCurrency(totalTips)}
                detail={`${helpers.formatCurrency(requestTipTotal)} requests · ${helpers.formatCurrency(supportTipTotal)} support`}
              />
            </View>
          </SectionCard>

          <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
            <View style={styles.dashboardColumn}>
              <SectionCard
                title="Request queue"
                eyebrow={topRequests.length ? "Showing the highest-priority songs first" : "No requests waiting"}
              >
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
                {sortedRequests.length > topRequests.length ? (
                  <Text style={styles.compactNote}>
                    {sortedRequests.length - topRequests.length} more requests remain below the fold.
                  </Text>
                ) : null}
              </SectionCard>
            </View>

            <View style={styles.dashboardColumn}>
              <SectionCard
                title="Running set"
                eyebrow={activeShow ? `${activeSetSongs.length} songs staged` : "Activate a show to manage the set"}
              >
                <ScrollView style={styles.embeddedScrollArea}>
                  <View style={styles.stackGap}>
                    {activeSetSongs.length ? (
                      activeSetSongs.slice(0, 6).map(({ song, index }) => (
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
                <Text style={styles.fieldLabel}>Quick add</Text>
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

              <SectionCard
                title="Tonight"
                eyebrow={lineupMembers.length ? `${lineupMembers.length} people assigned` : "No lineup assigned yet"}
              >
                <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
                  <MetricCard
                    label="Request tips"
                    value={helpers.formatCurrency(requestTipTotal)}
                    detail={`${sortedRequests.length} request entries`}
                  />
                  <MetricCard
                    label="Direct support"
                    value={helpers.formatCurrency(supportTipTotal)}
                    detail="Walk-up and support tips"
                  />
                </View>
                <View style={styles.pillWrap}>
                  {lineupMembers.length ? (
                    lineupMembers.map((member) => (
                      <View key={member.id} style={styles.personPill}>
                        <Text style={styles.personPillTitle}>{member.name}</Text>
                        <Text style={styles.personPillSubtitle}>{member.role}</Text>
                      </View>
                    ))
                  ) : (
                    <EmptyState label="Assign a lineup in Planning / Pre-Show first." />
                  )}
                </View>
              </SectionCard>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.sectionStack}>
          <SectionCard
            title={activeShow?.venue || "Planning workspace"}
            eyebrow={activeShow ? `${helpers.formatDate(activeShow.date)} · ${activeShow.city}` : "Choose or create a show"}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillWrap}>
                {state.shows.map((show) => {
                  const selected = show.id === activeShow?.id;
                  return (
                    <Pressable
                      key={show.id}
                      onPress={() => actions.setActiveShow(show.id)}
                      style={[styles.selectPill, selected && styles.selectPillActive]}
                    >
                      <Text style={[styles.selectPillText, selected && styles.selectPillTextActive]}>
                        {show.venue}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <View style={styles.tabRow}>
              {([
                ["shows", "Shows"],
                ["catalog", "Catalog"],
                ["band", "Band"],
                ["settings", "Settings"],
              ] as [PlanningPanel, string][]).map(([value, label]) => {
                const selected = planningPanel === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() => setPlanningPanel(value)}
                    style={[styles.tabPill, selected && styles.tabPillActive]}
                  >
                    <Text style={[styles.tabPillText, selected && styles.tabPillTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SectionCard>

          {planningPanel === "shows" ? (
            <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
              <View style={styles.dashboardColumn}>
                <SectionCard
                  title="Show roster"
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
                </SectionCard>
              </View>

              <View style={styles.dashboardColumn}>
                <SectionCard
                  title="Show setup"
                  eyebrow={activeShow ? `Editing ${activeShow.venue}` : "Select a show first"}
                >
                  <Text style={styles.fieldLabel}>Lineup</Text>
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
                        <EmptyState label="No songs staged for this show yet." />
                      )}
                    </View>
                  </ScrollView>
                  <Text style={styles.fieldLabel}>Add songs to this show</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pillWrap}>
                      {state.songs.map((song) => (
                        <Pressable
                          key={`${song.id}-planning`}
                          onPress={() => actions.addSongToSetList(song.id)}
                          style={styles.selectPill}
                        >
                          <Text style={styles.selectPillText}>{song.title}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </SectionCard>
              </View>
            </View>
          ) : null}

          {planningPanel === "catalog" ? (
            <SectionCard
              title="Song catalog"
              eyebrow={`${state.songs.length} songs available for requests and sets`}
            >
              <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
                <View style={styles.dashboardColumn}>
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
                </View>

                <View style={styles.dashboardColumn}>
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
                </View>
              </View>
            </SectionCard>
          ) : null}

          {planningPanel === "band" ? (
            <SectionCard
              title="Band + payouts"
              eyebrow={`${splitTotal}% total split configured`}
              sideLabel={splitTotal === 100 ? "Balanced" : "Needs review"}
              sideTone={splitTotal === 100 ? "good" : "warning"}
            >
              <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
                <View style={styles.dashboardColumn}>
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
                </View>

                <View style={styles.dashboardColumn}>
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
                </View>
              </View>
            </SectionCard>
          ) : null}

          {planningPanel === "settings" ? (
            <SectionCard
              title="Band links + device access"
              eyebrow="Shared manager-owned configuration"
            >
              <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
                <View style={styles.dashboardColumn}>
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
                </View>

                <View style={styles.dashboardColumn}>
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
                </View>
              </View>
            </SectionCard>
          ) : null}
        </View>
      )}
    </View>
  );
}
