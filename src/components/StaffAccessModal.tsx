import React, { useState } from "react";
import { Modal, Text, View } from "react-native";

import { GhostButton, PrimaryButton, TextInputField } from "./ui";
import { appStyles as styles } from "../styles/appStyles";

export function StaffAccessModal({
  onCancel,
  onConfirm,
  visible,
}: {
  onCancel: () => void;
  onConfirm: (passcode: string) => Promise<boolean>;
  visible: boolean;
}) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleCancel = () => {
    setPasscode("");
    setError("");
    onCancel();
  };

  const handleConfirm = async () => {
    const succeeded = await onConfirm(passcode);
    if (!succeeded) {
      setError("Passcode did not match staff access.");
      return;
    }

    setPasscode("");
    setError("");
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleCancel}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.eyebrow}>Staff access</Text>
          <Text style={styles.modalTitle}>Exit crowd kiosk mode?</Text>
          <Text style={styles.modalBody}>
            Enter the manager passcode to clear the crowd tablet session and return this device to
            setup.
          </Text>

          <TextInputField
            label="Manager passcode"
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

          <View style={styles.actionRow}>
            <GhostButton label="Cancel" onPress={handleCancel} />
            <PrimaryButton
              label="Continue"
              onPress={() => {
                void handleConfirm();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
