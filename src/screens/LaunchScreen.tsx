import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { PrimaryButton, SectionCard, TextInputField } from "../components/ui";
import { appStyles as styles } from "../styles/appStyles";
import { AccessSettings, Role } from "../types/stagehand";

const roleCopy: Record<
  Role,
  { title: string; eyebrow: string; description: string; needsPin: boolean }
> = {
  manager: {
    title: "Manager",
    eyebrow: "Protected workspace",
    description:
      "Control songs, shows, members, payout setup, and live request moderation.",
    needsPin: true,
  },
  member: {
    title: "Band member",
    eyebrow: "Protected workspace",
    description: "View the active set, queue, and payout snapshot during the show.",
    needsPin: true,
  },
  crowd: {
    title: "Crowd tablet",
    eyebrow: "Open kiosk mode",
    description: "Optimized for walk-up requests, boosts, merch, and direct support.",
    needsPin: false,
  },
};

export function LaunchScreen({
  access,
  onEnterRole,
}: {
  access: AccessSettings;
  onEnterRole: (role: Role) => void | Promise<void>;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>("crowd");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const selectedConfig = roleCopy[selectedRole];
  const accessLabel = useMemo(
    () => ({
      manager: access.managerPin,
      member: access.memberPin,
      crowd: "",
    }),
    [access.managerPin, access.memberPin],
  );

  const handleContinue = async () => {
    if (selectedConfig.needsPin) {
      const expectedPin = accessLabel[selectedRole];
      if (pin.trim() !== expectedPin) {
        setError("That passcode does not match this workspace.");
        return;
      }
    }

    setError("");
    setPin("");
    await onEnterRole(selectedRole);
  };

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Device launch</Text>
          <Text style={styles.sectionTitle}>Choose this device's job</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Crowd tablets stay open and simple. Manager and band-member modes require a local access
          code so the backstage tools are not accidentally exposed on venue devices.
        </Text>
      </View>

      <SectionCard title="Workspace access" eyebrow="Local launch control">
        <View style={styles.launchRoleGrid}>
          {(["manager", "member", "crowd"] as Role[]).map((role) => {
            const config = roleCopy[role];
            const active = role === selectedRole;
            return (
              <Pressable
                key={role}
                onPress={() => {
                  setSelectedRole(role);
                  setError("");
                  setPin("");
                }}
                style={[styles.launchRoleCard, active && styles.launchRoleCardActive]}
              >
                <Text style={[styles.eyebrow, active && styles.launchRoleEyebrowActive]}>
                  {config.eyebrow}
                </Text>
                <Text style={[styles.launchRoleTitle, active && styles.launchRoleTitleActive]}>
                  {role === "crowd" ? access.crowdLabel || config.title : config.title}
                </Text>
                <Text style={[styles.launchRoleBody, active && styles.launchRoleBodyActive]}>
                  {config.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedConfig.needsPin ? (
          <TextInputField
            label={`${selectedConfig.title} passcode`}
            value={pin}
            keyboardType="numeric"
            onChangeText={(text) => {
              setPin(text);
              if (error) {
                setError("");
              }
            }}
          />
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton
          label={
            selectedRole === "crowd"
              ? `Enter ${access.crowdLabel || "crowd tablet"}`
              : `Unlock ${selectedConfig.title}`
          }
          onPress={() => {
            void handleContinue();
          }}
        />

        <View style={styles.stackGap}>
          <Text style={styles.helperText}>
            Stub passcodes are editable from the manager workspace. This is a local-only gate for
            now, which gives us product shape before we add real authentication.
          </Text>
        </View>
      </SectionCard>
    </View>
  );
}
