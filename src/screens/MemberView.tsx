import React from "react";
import { Text, View } from "react-native";

import { EmptyState, RequestCard, RowCard, SectionCard } from "../components/ui";
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
  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Onstage mode</Text>
          <Text style={styles.sectionTitle}>Band member workspace</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Keep the next show, the live queue, and payout expectations visible during the set.
        </Text>
      </View>

      <SectionCard
        title={activeShow?.venue || "No active show"}
        eyebrow={activeShow ? helpers.formatDate(activeShow.date) : "Schedule pending"}
      >
        <Text style={styles.leadCopy}>
          {activeShow
            ? `${activeShow.city} · ${activeShow.notes || "No notes"}`
            : "Create an active show in manager mode to populate this view."}
        </Text>
        <View style={styles.pillWrap}>
          {activeShow?.lineup.length ? (
            activeShow.lineup.map((memberId) => {
              const member = helpers.memberById(memberId);
              if (!member) {
                return null;
              }
              return (
                <View key={member.id} style={styles.personPill}>
                  <Text style={styles.personPillTitle}>{member.name}</Text>
                  <Text style={styles.personPillSubtitle}>{member.role}</Text>
                </View>
              );
            })
          ) : (
            <EmptyState label="No lineup assigned yet." />
          )}
        </View>
      </SectionCard>

      <SectionCard
        title="Set list"
        eyebrow={activeShow?.setList.length ? `${activeShow.setList.length} songs queued` : "No songs attached"}
      >
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
      </SectionCard>

      <SectionCard
        title="Tip breakdown"
        eyebrow={`${helpers.formatCurrency(totalTips)} across requests and support`}
      >
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
      </SectionCard>

      <SectionCard title="Request queue" eyebrow={`${sortedRequests.length} requests waiting`}>
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
      </SectionCard>
    </View>
  );
}
