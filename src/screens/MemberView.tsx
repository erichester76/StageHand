import React from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { EmptyState, MetricCard, SectionCard } from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { Member, RequestItem, Show, Song, StageHandState } from "../types/stagehand";

type MemberHelpers = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  songById: (songId: string) => Song | undefined;
  memberById: (memberId: string) => Member | undefined;
};

type MemberPanel = "set" | "queue" | "tonight";

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

export function MemberView({
  activeShow,
  helpers,
  sortedRequests,
  state,
  totalTips,
}: {
  activeShow: Show | null;
  helpers: MemberHelpers;
  sortedRequests: RequestItem[];
  state: StageHandState;
  totalTips: number;
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const [panel, setPanel] = React.useState<MemberPanel>("set");
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [selectedSetIndex, setSelectedSetIndex] = React.useState<number | null>(null);

  const visibleMembers = activeShow
    ? activeShow.lineup
        .map((memberId) => helpers.memberById(memberId))
        .filter((member): member is Member => Boolean(member))
    : state.members;

  const activeSetSongs = activeShow
    ? activeShow.setList
        .map((songId, index) => {
          const song = helpers.songById(songId);
          return song ? { song, index } : null;
        })
        .filter((entry): entry is { song: Song; index: number } => Boolean(entry))
    : [];

  const currentSetEntry = activeShow ? activeSetSongs[activeShow.activeSetIndex] || activeSetSongs[0] || null : null;
  const nextSetEntry =
    currentSetEntry && currentSetEntry.index + 1 < activeSetSongs.length
      ? activeSetSongs[currentSetEntry.index + 1]
      : null;
  const selectedSetEntry =
    selectedSetIndex !== null ? activeSetSongs.find((entry) => entry.index === selectedSetIndex) || null : null;
  const selectedRequest = sortedRequests.find((request) => request.id === selectedRequestId) || null;
  const selectedRequestSong = selectedRequest ? helpers.songById(selectedRequest.songId) : undefined;
  const requestTipTotal = sortedRequests.reduce((sum, request) => sum + request.tip, 0);
  const supportTipTotal = totalTips - requestTipTotal;
  const toolbarMeta = activeShow
    ? `${activeShow.venue} · ${helpers.formatDate(activeShow.date)}`
    : "No active show selected";

  return (
    <View style={styles.sectionStack}>
      <View style={styles.toolbarShell}>
        <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
          <MetricCard
            label="Current song"
            value={currentSetEntry?.song.title || "No song staged"}
            detail={currentSetEntry ? `${currentSetEntry.song.energy} energy pocket` : "Waiting for a live set"}
          />
          <MetricCard
            label="Up next"
            value={nextSetEntry?.song.title || "Open slot"}
            detail={nextSetEntry ? `Position ${nextSetEntry.index + 1}` : "Watching for the next move"}
          />
          <MetricCard
            label="Live tips"
            value={helpers.formatCurrency(totalTips)}
            detail={`${sortedRequests.length} pending requests`}
          />
        </View>

        <View style={styles.toolbarRow}>
          {([
            ["set", "Set"],
            ["queue", "Queue"],
            ["tonight", "Tonight"],
          ] as [MemberPanel, string][]).map(([value, label]) => {
            const selected = panel === value;
            return (
              <Pressable
                key={value}
                onPress={() => setPanel(value)}
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

      {panel === "set" ? (
        <SectionCard
          title="Set flow"
          eyebrow={activeSetSongs.length ? `${activeSetSongs.length} songs staged` : "No active set list"}
          sideLabel={currentSetEntry ? `Song ${currentSetEntry.index + 1}` : undefined}
          sideTone="good"
        >
          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {activeSetSongs.length ? (
                activeSetSongs.map(({ song, index }) => (
                  <CompactListRow
                    key={`${song.id}-${index}`}
                    title={`${index === (activeShow?.activeSetIndex || 0) ? "Now: " : ""}${song.title}`}
                    selected={selectedSetIndex === index}
                    onPress={() => setSelectedSetIndex(index)}
                    last={index === activeSetSongs.length - 1}
                  />
                ))
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="No set list available yet." />
                </View>
              )}
            </View>
          </ScrollView>

          {selectedSetEntry ? (
            <SectionCard
              title={selectedSetEntry.song.title}
              eyebrow={`${selectedSetEntry.song.artist} · ${selectedSetEntry.song.key || "Key TBD"} · ${selectedSetEntry.song.energy}`}
            >
              <Text style={styles.leadCopy}>
                {selectedSetEntry.index === (activeShow?.activeSetIndex || 0)
                  ? "This is the current live song in the running order."
                  : selectedSetEntry.index === (activeShow?.activeSetIndex || 0) + 1
                    ? "This is the next staged song after the current live song."
                    : `Position ${selectedSetEntry.index + 1} in the current running order.`}
              </Text>
              <Text style={styles.compactNote}>
                {selectedSetEntry.song.lyricsLink || "No lyrics link saved for this song yet."}
              </Text>
            </SectionCard>
          ) : activeSetSongs.length ? (
            <Text style={styles.compactNote}>Tap a song to see the next cue and saved song details.</Text>
          ) : null}
        </SectionCard>
      ) : null}

      {panel === "queue" ? (
        <SectionCard
          title="Request queue"
          eyebrow={sortedRequests.length ? `${sortedRequests.length} requests waiting` : "No live requests"}
          sideLabel={activeShow?.requestMode === "manual" ? "Manual" : "Auto"}
          sideTone={activeShow?.requestMode === "manual" ? "warning" : "good"}
        >
          <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
            <MetricCard
              label="Request tips"
              value={helpers.formatCurrency(requestTipTotal)}
              detail="Audience demand in the room"
            />
            <MetricCard
              label="Scheduling"
              value={activeShow?.requestMode === "manual" ? "Manager placed" : "Auto interleave"}
              detail={
                activeShow?.requestMode === "manual"
                  ? "Manager drops requests into the set manually."
                  : "Requests can slide into matching energy pockets."
              }
            />
          </View>

          <ScrollView style={styles.embeddedScrollAreaTall}>
            <View style={styles.compactList}>
              {sortedRequests.length ? (
                sortedRequests.map((request, index) => {
                  const song = helpers.songById(request.songId);
                  if (!song) {
                    return null;
                  }
                  return (
                    <CompactListRow
                      key={request.id}
                      title={song.title}
                      selected={selectedRequestId === request.id}
                      onPress={() => setSelectedRequestId(request.id)}
                      last={index === sortedRequests.length - 1}
                    />
                  );
                })
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="No live requests right now." />
                </View>
              )}
            </View>
          </ScrollView>

          {selectedRequest ? (
            <SectionCard
              title={selectedRequestSong?.title || "Selected request"}
              eyebrow={`${selectedRequest.requester} · ${helpers.formatCurrency(selectedRequest.tip)} · ${selectedRequest.upvotes} boosts`}
            >
              <Text style={styles.leadCopy}>{selectedRequest.note || "No note from the crowd."}</Text>
              <Text style={styles.compactNote}>
                {activeShow?.requestMode === "manual"
                  ? "This request stays in the queue until the manager schedules it into the set."
                  : "This request can move up the running order when boosts push it ahead in the energy pocket."}
              </Text>
            </SectionCard>
          ) : sortedRequests.length ? (
            <Text style={styles.compactNote}>Tap a request to see who asked for it and how hard the room is pushing it.</Text>
          ) : null}
        </SectionCard>
      ) : null}

      {panel === "tonight" ? (
        <SectionCard
          title="Tonight"
          eyebrow={activeShow ? `${activeShow.venue} · ${activeShow.city}` : "No active show selected"}
        >
          <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
            <MetricCard
              label="Support tips"
              value={helpers.formatCurrency(supportTipTotal)}
              detail="Direct support during the show"
            />
            <MetricCard
              label="Lineup"
              value={`${visibleMembers.length}`}
              detail="Players assigned tonight"
            />
            <MetricCard
              label="Payout pool"
              value={helpers.formatCurrency(totalTips)}
              detail="Current tracked total"
            />
          </View>

          <Text style={styles.fieldLabel}>Tonight's lineup</Text>
          <View style={styles.compactList}>
            {visibleMembers.length ? (
              visibleMembers.map((member, index) => (
                <CompactListRow
                  key={member.id}
                  title={member.name}
                  aside={<Text style={styles.compactNote}>{member.role}</Text>}
                  last={index === visibleMembers.length - 1}
                />
              ))
            ) : (
              <View style={styles.compactListRowLast}>
                <EmptyState label="No lineup assigned yet." />
              </View>
            )}
          </View>

          <Text style={styles.fieldLabel}>Payout snapshot</Text>
          <ScrollView style={styles.embeddedScrollArea}>
            <View style={styles.compactList}>
              {state.members.length ? (
                state.members.map((member, index) => (
                  <CompactListRow
                    key={`${member.id}-payout`}
                    title={member.name}
                    aside={
                      <Text style={styles.moneyText}>
                        {helpers.formatCurrency(totalTips * (member.allocation / 100))}
                      </Text>
                    }
                    last={index === state.members.length - 1}
                  />
                ))
              ) : (
                <View style={styles.compactListRowLast}>
                  <EmptyState label="No payout allocations configured yet." />
                </View>
              )}
            </View>
          </ScrollView>
        </SectionCard>
      ) : null}
    </View>
  );
}
