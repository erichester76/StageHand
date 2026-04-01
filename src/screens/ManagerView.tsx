import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import {
  EmptyState,
  GhostButton,
  PrimaryButton,
  RequestCard,
  RowCard,
  SectionCard,
  TextInputField,
} from "../components/ui";
import { nextFriday } from "../lib/stagehand";
import { appStyles as styles } from "../styles/appStyles";
import { Member, RequestItem, Show, Song, StageHandState } from "../types/stagehand";

type ManagerHelpers = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  normalizeEnergy: (value: string) => Song["energy"];
  songById: (songId: string) => Song | undefined;
};

type ManagerActions = {
  updateProfile: (profile: StageHandState["links"] & { bandName: string }) => void;
  updateAccess: (access: StageHandState["access"]) => void;
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
  const [profile, setProfile] = useState({
    bandName: state.bandName,
    merchStore: state.links.merchStore,
    showCalendar: state.links.showCalendar,
    venmo: state.links.venmo,
    cashapp: state.links.cashapp,
    paypal: state.links.paypal,
  });
  const [accessDraft, setAccessDraft] = useState(state.access);
  const [songDraft, setSongDraft] = useState({
    title: "",
    artist: "",
    energy: "Mid" as Song["energy"],
  });
  const [memberDraft, setMemberDraft] = useState({ name: "", role: "", allocation: "25" });
  const [showDraft, setShowDraft] = useState({
    date: nextFriday(),
    venue: "",
    city: "",
    notes: "",
  });
  const [selectedSongId, setSelectedSongId] = useState(state.songs[0]?.id || "");

  useEffect(() => {
    setProfile({
      bandName: state.bandName,
      merchStore: state.links.merchStore,
      showCalendar: state.links.showCalendar,
      venmo: state.links.venmo,
      cashapp: state.links.cashapp,
      paypal: state.links.paypal,
    });
    setAccessDraft(state.access);
  }, [state.bandName, state.links]);

  useEffect(() => {
    if (!state.songs.find((song) => song.id === selectedSongId)) {
      setSelectedSongId(state.songs[0]?.id || "");
    }
  }, [selectedSongId, state.songs]);

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Backstage control room</Text>
          <Text style={styles.sectionTitle}>Manager workspace</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Edit the full operating model: songs, shows, members, links, lineups, and the live queue.
        </Text>
      </View>

      <SectionCard title="Band profile" eyebrow="Links and payouts">
        <TextInputField
          label="Band name"
          value={profile.bandName}
          onChangeText={(text) => setProfile((current) => ({ ...current, bandName: text }))}
        />
        <TextInputField
          label="Merch store"
          value={profile.merchStore}
          onChangeText={(text) => setProfile((current) => ({ ...current, merchStore: text }))}
        />
        <TextInputField
          label="Show calendar"
          value={profile.showCalendar}
          onChangeText={(text) => setProfile((current) => ({ ...current, showCalendar: text }))}
        />
        <TextInputField
          label="Venmo"
          value={profile.venmo}
          onChangeText={(text) => setProfile((current) => ({ ...current, venmo: text }))}
        />
        <TextInputField
          label="Cash App"
          value={profile.cashapp}
          onChangeText={(text) => setProfile((current) => ({ ...current, cashapp: text }))}
        />
        <TextInputField
          label="PayPal"
          value={profile.paypal}
          onChangeText={(text) => setProfile((current) => ({ ...current, paypal: text }))}
        />
        <PrimaryButton label="Save profile" onPress={() => actions.updateProfile(profile)} />
      </SectionCard>

      <SectionCard title="Access controls" eyebrow="Local workspace passcodes">
        <TextInputField
          label="Manager passcode"
          value={accessDraft.managerPin}
          keyboardType="numeric"
          onChangeText={(text) => setAccessDraft((current) => ({ ...current, managerPin: text }))}
        />
        <TextInputField
          label="Band member passcode"
          value={accessDraft.memberPin}
          keyboardType="numeric"
          onChangeText={(text) => setAccessDraft((current) => ({ ...current, memberPin: text }))}
        />
        <TextInputField
          label="Crowd device label"
          value={accessDraft.crowdLabel}
          onChangeText={(text) => setAccessDraft((current) => ({ ...current, crowdLabel: text }))}
        />
        <PrimaryButton
          label="Save access settings"
          onPress={() =>
            actions.updateAccess({
              managerPin: accessDraft.managerPin.trim() || state.access.managerPin,
              memberPin: accessDraft.memberPin.trim() || state.access.memberPin,
              crowdLabel: accessDraft.crowdLabel.trim() || state.access.crowdLabel,
            })
          }
        />
      </SectionCard>

      <SectionCard title="Song catalog" eyebrow={`${state.songs.length} songs in rotation`}>
        <TextInputField
          label="Song title"
          value={songDraft.title}
          onChangeText={(text) => setSongDraft((current) => ({ ...current, title: text }))}
        />
        <TextInputField
          label="Original artist or note"
          value={songDraft.artist}
          onChangeText={(text) => setSongDraft((current) => ({ ...current, artist: text }))}
        />
        <TextInputField
          label="Energy"
          value={songDraft.energy}
          onChangeText={(text) =>
            setSongDraft((current) => ({ ...current, energy: helpers.normalizeEnergy(text) }))
          }
        />
        <PrimaryButton
          label="Add song"
          onPress={() => {
            if (!songDraft.title.trim() || !songDraft.artist.trim()) {
              return;
            }
            actions.addSong({
              title: songDraft.title.trim(),
              artist: songDraft.artist.trim(),
              energy: songDraft.energy,
            });
            setSongDraft({ title: "", artist: "", energy: "Mid" });
          }}
        />
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
      </SectionCard>

      <SectionCard
        title="Band members"
        eyebrow={`${state.members.length} members`}
        sideLabel={splitTotal === 100 ? "Splits total 100%" : `Splits total ${splitTotal}%`}
        sideTone={splitTotal === 100 ? "good" : "warning"}
      >
        <TextInputField
          label="Member name"
          value={memberDraft.name}
          onChangeText={(text) => setMemberDraft((current) => ({ ...current, name: text }))}
        />
        <TextInputField
          label="Role"
          value={memberDraft.role}
          onChangeText={(text) => setMemberDraft((current) => ({ ...current, role: text }))}
        />
        <TextInputField
          label="Tip allocation %"
          value={memberDraft.allocation}
          keyboardType="numeric"
          onChangeText={(text) =>
            setMemberDraft((current) => ({ ...current, allocation: text }))
          }
        />
        <PrimaryButton
          label="Add member"
          onPress={() => {
            if (!memberDraft.name.trim() || !memberDraft.role.trim()) {
              return;
            }
            actions.addMember({
              name: memberDraft.name.trim(),
              role: memberDraft.role.trim(),
              allocation: Number(memberDraft.allocation) || 0,
            });
            setMemberDraft({ name: "", role: "", allocation: "25" });
          }}
        />
        <View style={styles.stackGap}>
          {state.members.map((member) => (
            <View key={member.id} style={styles.rowCard}>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>{member.name}</Text>
                <Text style={styles.rowSubtitle}>{member.role}</Text>
              </View>
              <View style={styles.rowAside}>
                <TextInput
                  style={[styles.input, styles.inlineAllocation]}
                  value={String(member.allocation)}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    actions.updateMemberAllocation(member.id, Number(text) || 0)
                  }
                />
                <GhostButton label="Remove" onPress={() => actions.removeMember(member.id)} />
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Shows and set lists"
        eyebrow={activeShow ? `Active show · ${activeShow.venue}` : "No active show"}
      >
        <TextInputField
          label="Show date"
          value={showDraft.date}
          onChangeText={(text) => setShowDraft((current) => ({ ...current, date: text }))}
        />
        <TextInputField
          label="Venue"
          value={showDraft.venue}
          onChangeText={(text) => setShowDraft((current) => ({ ...current, venue: text }))}
        />
        <TextInputField
          label="City"
          value={showDraft.city}
          onChangeText={(text) => setShowDraft((current) => ({ ...current, city: text }))}
        />
        <TextInputField
          label="Notes"
          value={showDraft.notes}
          onChangeText={(text) => setShowDraft((current) => ({ ...current, notes: text }))}
        />
        <PrimaryButton
          label="Add show"
          onPress={() => {
            if (!showDraft.venue.trim() || !showDraft.city.trim()) {
              return;
            }
            actions.addShow({
              date: showDraft.date.trim() || nextFriday(),
              venue: showDraft.venue.trim(),
              city: showDraft.city.trim(),
              notes: showDraft.notes.trim(),
            });
            setShowDraft({ date: nextFriday(), venue: "", city: "", notes: "" });
          }}
        />

        <View style={styles.stackGap}>
          {state.shows.map((show) => (
            <View key={show.id} style={styles.rowCard}>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>{show.venue}</Text>
                <Text style={styles.rowSubtitle}>
                  {helpers.formatDate(show.date)} · {show.city}
                </Text>
                <Text style={styles.rowSubtitle}>{show.notes || "No notes yet"}</Text>
              </View>
              <View style={styles.rowAside}>
                <GhostButton
                  label={show.id === state.activeShowId ? "Active" : "Make active"}
                  onPress={() => actions.setActiveShow(show.id)}
                />
                <GhostButton label="Remove" onPress={() => actions.removeShow(show.id)} />
              </View>
            </View>
          ))}
        </View>

        {activeShow ? (
          <>
            <Text style={styles.subheading}>Lineup for active show</Text>
            <View style={styles.pillWrap}>
              {state.members.map((member) => {
                const active = activeShow.lineup.includes(member.id);
                return (
                  <Pressable
                    key={member.id}
                    onPress={() => actions.toggleLineupMember(member.id)}
                    style={[styles.togglePill, active && styles.togglePillActive]}
                  >
                    <Text style={[styles.togglePillText, active && styles.togglePillTextActive]}>
                      {member.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.subheading}>Attach songs to set list</Text>
            <View style={styles.pillWrap}>
              {state.songs.map((song) => (
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
            <PrimaryButton
              label="Add selected song to set"
              onPress={() => selectedSongId && actions.addSongToSetList(selectedSongId)}
            />

            <View style={styles.stackGap}>
              {activeShow.setList.length ? (
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
                      aside={
                        <GhostButton
                          label="Remove"
                          onPress={() => actions.removeSongFromSetList(songId)}
                        />
                      }
                    />
                  );
                })
              ) : (
                <EmptyState label="No songs attached to the active show yet." />
              )}
            </View>
          </>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Live queue"
        eyebrow={`${helpers.formatCurrency(totalTips)} total tipped tonight`}
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
                  primaryAction={() => actions.boostRequest(request.id)}
                  secondaryLabel="Clear"
                  secondaryAction={() => actions.clearRequest(request.id)}
                />
              );
            })
          ) : (
            <EmptyState label="No requests in the queue yet." />
          )}
        </View>
      </SectionCard>
    </View>
  );
}
