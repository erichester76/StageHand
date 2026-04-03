import React, { useState } from "react";
import { Text, View } from "react-native";

import { GhostButton, PrimaryButton, SectionCard, TextInputField } from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { ProtectedRole } from "../types/stagehand";

const roleCopy: Record<ProtectedRole, { title: string; description: string }> = {
  manager: {
    title: "Manager device",
    description:
      "Unlock the full backstage workspace for songs, shows, member management, and live controls.",
  },
  member: {
    title: "Band-member device",
    description:
      "Unlock the active set, request queue, and payout snapshot without exposing manager controls.",
  },
};

export function UnlockScreen({
  role,
  onUnlock,
  onReprovision,
}: {
  role: ProtectedRole;
  onUnlock: (passcode: string) => Promise<boolean>;
  onReprovision: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    const succeeded = await onUnlock(passcode);
    if (!succeeded) {
      setError("That passcode does not match this device session.");
      return;
    }

    setError("");
    setPasscode("");
  };

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Protected access</Text>
          <Text style={styles.sectionTitle}>Unlock this device</Text>
        </View>
        <Text style={styles.sectionCopy}>
          This device is already provisioned. Unlock it to continue into the protected workspace.
        </Text>
      </View>

      <SectionCard title={roleCopy[role].title} eyebrow="Provisioned device session">
        <Text style={styles.leadCopy}>{roleCopy[role].description}</Text>

        <TextInputField
          label="Passcode"
          value={passcode}
          keyboardType="numeric"
          onChangeText={(text) => {
            setPasscode(text);
            if (error) {
              setError("");
            }
          }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton
          label={`Unlock ${roleCopy[role].title}`}
          onPress={() => {
            void handleUnlock();
          }}
        />

        <GhostButton label="Reprovision this device" onPress={onReprovision} />
      </SectionCard>
    </View>
  );
}
