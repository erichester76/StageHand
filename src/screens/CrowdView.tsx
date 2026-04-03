import React, { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

import {
  EmptyState,
  MetricCard,
  PrimaryButton,
  RequestCard,
  RowCard,
  SectionCard,
  TextInputField,
} from "../components/ui";
import { emptyLinks } from "../lib/stagehand";
import { appStyles as styles } from "../styles/appStyles";
import { BandLinks, RequestItem, Show, Song, SupportTip } from "../types/stagehand";

type CrowdHelpers = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  formatLink: (label: string, value: string) => string;
  songById: (songId: string) => Song | undefined;
};

type CrowdPanel = "request" | "support" | "queue";

export function CrowdView({
  activeShow,
  bandName,
  boostRequest,
  crowdLabel,
  helpers,
  isTablet,
  links,
  onRequestStaffAccess,
  addRequest,
  addSupportTip,
  songs,
  sortedRequests,
  supportTips,
}: {
  activeShow: Show | null;
  bandName: string;
  boostRequest: (requestId: string) => void;
  crowdLabel: string;
  helpers: CrowdHelpers;
  isTablet: boolean;
  links: BandLinks;
  onRequestStaffAccess: () => void;
  addRequest: (payload: { requester: string; songId: string; note: string; tip: number }) => void;
  addSupportTip: (payload: { supporter: string; amount: number; note: string }) => void;
  songs: Song[];
  sortedRequests: RequestItem[];
  supportTips: SupportTip[];
}) {
  const [activePanel, setActivePanel] = useState<CrowdPanel>("request");
  const [requester, setRequester] = useState("");
  const [selectedSongId, setSelectedSongId] = useState(songs[0]?.id || "");
  const [requestNote, setRequestNote] = useState("");
  const [tipAmount, setTipAmount] = useState("5");
  const [supporter, setSupporter] = useState("");
  const [supportAmount, setSupportAmount] = useState("10");
  const [supportNote, setSupportNote] = useState("");

  useEffect(() => {
    if (!songs.find((song) => song.id === selectedSongId)) {
      setSelectedSongId(songs[0]?.id || "");
    }
  }, [selectedSongId, songs]);

  const supportLinks = emptyLinks(links);

  return (
    <View style={styles.sectionStack}>
      <Pressable
        delayLongPress={3000}
        onLongPress={onRequestStaffAccess}
        style={styles.sectionHeader}
      >
        <View>
          <Text style={styles.eyebrow}>Audience mode</Text>
          <Text style={styles.sectionTitle}>{crowdLabel}</Text>
        </View>
        <Text style={styles.sectionCopy}>
          The crowd mockup now behaves more like a kiosk dashboard: quick action cards, shorter
          queue visibility, and far less vertical wandering.
        </Text>
      </Pressable>

      <SectionCard
        title={activeShow?.venue || bandName}
        eyebrow={activeShow ? helpers.formatDate(activeShow.date) : "No active show"}
      >
        <View style={[styles.metricGrid, isTablet && styles.metricGridTablet]}>
          <MetricCard
            label="Now playing"
            value={activeShow?.city || "Waiting"}
            detail={activeShow ? bandName : "Show not activated yet"}
          />
          <MetricCard
            label="Requests live"
            value={`${sortedRequests.length}`}
            detail="Songs in the room queue"
          />
          <MetricCard
            label="Support tips"
            value={`${supportTips.length}`}
            detail="Direct support entries"
          />
        </View>
      </SectionCard>

      {!isTablet ? (
        <View style={styles.tabRow}>
          {([
            ["request", "Request"],
            ["support", "Support"],
            ["queue", "Queue"],
          ] as [CrowdPanel, string][]).map(([panel, label]) => {
            const active = activePanel === panel;
            return (
              <Pressable
                key={panel}
                onPress={() => setActivePanel(panel)}
                style={[styles.tabPill, active && styles.tabPillActive]}
              >
                <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View style={[styles.crowdColumns, isTablet && styles.crowdColumnsTablet]}>
        {isTablet || activePanel === "request" ? (
          <View style={styles.crowdLeftColumn}>
            <SectionCard title="Request a song" eyebrow="Fast walk-up flow">
              <TextInputField label="Your name" value={requester} onChangeText={setRequester} />
              <Text style={styles.fieldLabel}>Song</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillWrap}>
                  {songs.map((song) => (
                    <Pressable
                      key={song.id}
                      onPress={() => setSelectedSongId(song.id)}
                      style={[
                        styles.selectPill,
                        selectedSongId === song.id && styles.selectPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.selectPillText,
                          selectedSongId === song.id && styles.selectPillTextActive,
                        ]}
                      >
                        {song.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
              <TextInputField label="Message" value={requestNote} onChangeText={setRequestNote} />
              <TextInputField
                label="Tip amount"
                value={tipAmount}
                keyboardType="numeric"
                onChangeText={setTipAmount}
              />
              <PrimaryButton
                label="Send request"
                onPress={() => {
                  if (!requester.trim() || !selectedSongId) {
                    return;
                  }
                  addRequest({
                    requester: requester.trim(),
                    songId: selectedSongId,
                    note: requestNote.trim(),
                    tip: Number(tipAmount) || 0,
                  });
                  setRequester("");
                  setRequestNote("");
                  setTipAmount("5");
                }}
              />
            </SectionCard>
          </View>
        ) : null}

        {isTablet || activePanel === "support" ? (
          <View style={styles.crowdLeftColumn}>
            <SectionCard title="Support the band" eyebrow="Tip jar plus link handoff">
              <TextInputField label="Your name" value={supporter} onChangeText={setSupporter} />
              <TextInputField
                label="Amount"
                value={supportAmount}
                keyboardType="numeric"
                onChangeText={setSupportAmount}
              />
              <TextInputField label="Note" value={supportNote} onChangeText={setSupportNote} />
              <PrimaryButton
                label="Add support tip"
                onPress={() => {
                  if (!supporter.trim()) {
                    return;
                  }
                  addSupportTip({
                    supporter: supporter.trim(),
                    amount: Number(supportAmount) || 0,
                    note: supportNote.trim(),
                  });
                  setSupporter("");
                  setSupportAmount("10");
                  setSupportNote("");
                }}
              />
              <View style={[styles.linkGrid, isTablet && styles.linkGridTablet]}>
                {supportLinks.map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => void Linking.openURL(helpers.formatLink(item.label, item.value))}
                    style={styles.linkCard}
                  >
                    <Text style={styles.linkCardTitle}>{item.label}</Text>
                    <Text style={styles.linkCardValue}>{item.value}</Text>
                  </Pressable>
                ))}
              </View>
            </SectionCard>
          </View>
        ) : null}

        {isTablet || activePanel === "queue" ? (
          <View style={styles.crowdRightColumn}>
            <SectionCard
              title="Live request queue"
              eyebrow={`${sortedRequests.length} songs competing right now`}
            >
              <ScrollView style={styles.embeddedScrollAreaTall}>
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
                          primaryLabel="Boost +$5"
                          primaryAction={() => boostRequest(request.id)}
                        />
                      );
                    })
                  ) : (
                    <EmptyState label="The request queue is empty. Be the first one in." />
                  )}
                </View>
              </ScrollView>
            </SectionCard>

            <SectionCard title="Recent support" eyebrow={`${supportTips.length} direct tips logged`}>
              <ScrollView style={styles.embeddedScrollArea}>
                <View style={styles.stackGap}>
                  {supportTips.length ? (
                    supportTips.map((tip) => (
                      <RowCard
                        key={tip.id}
                        title={tip.supporter}
                        subtitle={tip.note || "General support tip"}
                        aside={<Text style={styles.moneyText}>{helpers.formatCurrency(tip.amount)}</Text>}
                      />
                    ))
                  ) : (
                    <EmptyState label="No direct support tips yet." />
                  )}
                </View>
              </ScrollView>
            </SectionCard>
          </View>
        ) : null}
      </View>
    </View>
  );
}
