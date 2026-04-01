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
  onProvisionRole,
}: {
  access: AccessSettings;
  onProvisionRole: (role: Role) => void | Promise<void>;
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
    await onProvisionRole(selectedRole);
  };

  return (
    <View style={styles.sectionStack}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>Device setup</Text>
          <Text style={styles.sectionTitle}>Provision this device</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Choose whether this phone or tablet should behave like a manager device, a band-member
          device, or a public crowd kiosk. Protected roles require a local passcode before the
          session is provisioned.
        </Text>
      </View>

      <SectionCard title="Device roles" eyebrow="Local provisioning flow">
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
              ? `Provision ${access.crowdLabel || "crowd tablet"}`
              : `Provision ${selectedConfig.title}`
          }
          onPress={() => {
            void handleContinue();
          }}
        />

        <View style={styles.stackGap}>
          <Text style={styles.helperText}>
            This stores a local device session only. Manager and member devices will still require
            unlock on relaunch, which keeps the shell compatible with future real authentication.
          </Text>
        </View>
      </SectionCard>
    </View>
  );
}
