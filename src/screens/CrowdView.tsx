import React, { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

import {
  EmptyState,
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

export function CrowdView({
  activeShow,
  bandName,
  boostRequest,
  helpers,
  isTablet,
  links,
  addRequest,
  addSupportTip,
  songs,
  sortedRequests,
  supportTips,
}: {
  activeShow: Show | null;
  bandName: string;
  boostRequest: (requestId: string) => void;
  helpers: CrowdHelpers;
  isTablet: boolean;
  links: BandLinks;
  addRequest: (payload: { requester: string; songId: string; note: string; tip: number }) => void;
  addSupportTip: (payload: { supporter: string; amount: number; note: string }) => void;
  songs: Song[];
  sortedRequests: RequestItem[];
  supportTips: SupportTip[];
}) {
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
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Audience mode</Text>
          <Text style={styles.sectionTitle}>Crowd workspace</Text>
        </View>
        <Text style={styles.sectionCopy}>
          This layout is built to breathe on a tablet, with request entry and support actions beside a live-updating queue.
        </Text>
      </View>

      <SectionCard
        title={activeShow?.venue || bandName}
        eyebrow={activeShow ? helpers.formatDate(activeShow.date) : "No active show"}
      >
        <Text style={styles.leadCopy}>
          {activeShow
            ? `${bandName} is playing ${activeShow.city}. Request a song, boost the queue, buy merch, or tip the band directly.`
            : `${bandName} has not selected an active show yet, but support links and the catalog are still available.`}
        </Text>
      </SectionCard>

      <View style={[styles.crowdColumns, isTablet && styles.crowdColumnsTablet]}>
        <View style={styles.crowdLeftColumn}>
          <SectionCard title="Request a song" eyebrow="Built for walk-up crowd use">
            <TextInputField label="Your name" value={requester} onChangeText={setRequester} />
            <Text style={styles.fieldLabel}>Song</Text>
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

          <SectionCard title="Support the band" eyebrow="Fast tip jar and handoff links">
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
            <View style={styles.stackGap}>
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

        <View style={styles.crowdRightColumn}>
          <SectionCard
            title="Live request queue"
            eyebrow={`${sortedRequests.length} songs competing right now`}
          >
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
          </SectionCard>

          <SectionCard title="Recent support" eyebrow={`${supportTips.length} direct tips logged`}>
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
          </SectionCard>
        </View>
      </View>
    </View>
  );
}
