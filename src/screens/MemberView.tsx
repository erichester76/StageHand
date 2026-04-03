import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { EmptyState, MetricCard, RequestCard, RowCard, SectionCard } from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { Member, RequestItem, Show, Song, StageHandState } from "../types/stagehand";

type MemberHelpers = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  songById: (songId: string) => Song | undefined;
  memberById: (memberId: string) => Member | undefined;
};

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
  const visibleMembers = activeShow
    ? activeShow.lineup
        .map((memberId) => helpers.memberById(memberId))
        .filter((member): member is Member => Boolean(member))
    : state.members;

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Onstage mode</Text>
          <Text style={styles.sectionTitle}>Band member workspace</Text>
        </View>
        <Text style={styles.sectionCopy}>
          The member view is now treated like a stage monitor: immediate context on top, then set,
          queue, and payout panels in a compact grid.
        </Text>
      </View>

      <SectionCard
        title={activeShow?.venue || "No active show"}
        eyebrow={activeShow ? helpers.formatDate(activeShow.date) : "Schedule pending"}
      >
        <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
          <MetricCard
            label="Current city"
            value={activeShow?.city || "TBD"}
            detail={activeShow?.notes || "No show notes"}
          />
          <MetricCard
            label="Set songs"
            value={`${activeShow?.setList.length || 0}`}
            detail="Songs queued for the set"
          />
          <MetricCard
            label="Tips tracked"
            value={helpers.formatCurrency(totalTips)}
            detail={`${sortedRequests.length} request entries`}
          />
        </View>
      </SectionCard>

      <View style={[styles.dashboardColumns, isTablet && styles.dashboardColumnsTablet]}>
        <View style={styles.dashboardColumn}>
          <SectionCard
            title="Set list"
            eyebrow={
              activeShow?.setList.length ? `${activeShow.setList.length} songs queued` : "No songs attached"
            }
          >
            <ScrollView style={styles.embeddedScrollArea}>
              <View style={styles.stackGap}>
                {activeShow?.setList.length ? (
                  activeShow.setList.map((songId, index) => {
                    const song = helpers.songById(songId);
                    if (!song) {
                      return null;
                    }
                    return (
                      <RowCard
                        key={`${songId}-${index}`}
                        title={`${index + 1}. ${song.title}`}
                        subtitle={`${song.artist} · ${song.energy} energy`}
                      />
                    );
                  })
                ) : (
                  <EmptyState label="No set list available yet." />
                )}
              </View>
            </ScrollView>
          </SectionCard>

          <SectionCard
            title="Lineup"
            eyebrow={visibleMembers.length ? `${visibleMembers.length} players on this show` : "No lineup assigned"}
          >
            <View style={styles.pillWrap}>
              {visibleMembers.length ? (
                visibleMembers.map((member) => (
                  <View key={member.id} style={styles.personPill}>
                    <Text style={styles.personPillTitle}>{member.name}</Text>
                    <Text style={styles.personPillSubtitle}>{member.role}</Text>
                  </View>
                ))
              ) : (
                <EmptyState label="No lineup assigned yet." />
              )}
            </View>
          </SectionCard>
        </View>

        <View style={styles.dashboardColumn}>
          <SectionCard title="Request queue" eyebrow={`${sortedRequests.length} requests waiting`}>
            <ScrollView style={styles.embeddedScrollArea}>
              <View style={styles.stackGap}>
                {sortedRequests.length ? (
                  sortedRequests.map((request) => {
                    const song = helpers.songById(request.songId);
                    if (!song) {
                      return null;
                    }
                    return (
                      <RequestCard
                        key={request.id}
                        title={song.title}
                        subtitle={`${song.artist} · ${request.requester}`}
                        note={request.note || "No note"}
                        value={`${helpers.formatCurrency(request.tip)} · ${request.upvotes} boosts`}
                      />
                    );
                  })
                ) : (
                  <EmptyState label="No live requests right now." />
                )}
              </View>
            </ScrollView>
          </SectionCard>

          <SectionCard
            title="Payout snapshot"
            eyebrow={`${helpers.formatCurrency(totalTips)} across requests and support`}
          >
            <ScrollView style={styles.embeddedScrollArea}>
              <View style={styles.stackGap}>
                {state.members.map((member) => (
                  <RowCard
                    key={member.id}
                    title={member.name}
                    subtitle={`${member.role} · ${member.allocation}% split`}
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
        </View>
      </View>
    </View>
  );
}
