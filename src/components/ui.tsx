import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "../constants/theme";
import { appStyles as styles } from "../styles/appStyles";

export function SectionCard({
  title,
  eyebrow,
  children,
  sideLabel,
  sideTone,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  sideLabel?: string;
  sideTone?: "good" | "warning";
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {sideLabel ? (
          <View
            style={[
              styles.sidePill,
              sideTone === "good" ? styles.sidePillGood : styles.sidePillWarning,
            ]}
          >
            <Text
              style={[
                styles.sidePillText,
                sideTone === "good" ? styles.sidePillTextGood : styles.sidePillTextWarning,
              ]}
            >
              {sideLabel}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.stackGap}>{children}</View>
    </View>
  );
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.eyebrow}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

export function TextInputField({
  label,
  value,
  keyboardType,
  onChangeText,
}: {
  label: string;
  value: string;
  keyboardType?: "default" | "numeric";
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

export function RowCard({
  title,
  subtitle,
  aside,
}: {
  title: string;
  subtitle: string;
  aside?: React.ReactNode;
}) {
  return (
    <View style={styles.rowCard}>
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {aside ? <View style={styles.rowAside}>{aside}</View> : null}
    </View>
  );
}

export function RequestCard({
  title,
  subtitle,
  note,
  value,
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
}: {
  title: string;
  subtitle: string;
  note: string;
  value: string;
  primaryLabel?: string;
  primaryAction?: () => void;
  secondaryLabel?: string;
  secondaryAction?: () => void;
}) {
  return (
    <View style={styles.requestCard}>
      <View style={styles.requestTopRow}>
        <View style={styles.requestValuePill}>
          <Text style={styles.requestValuePillText}>{value}</Text>
        </View>
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
      <Text style={styles.noteText}>{note}</Text>
      <View style={styles.actionRow}>
        {primaryLabel && primaryAction ? (
          <PrimaryButton label={primaryLabel} onPress={primaryAction} compact />
        ) : null}
        {secondaryLabel && secondaryAction ? (
          <GhostButton label={secondaryLabel} onPress={secondaryAction} />
        ) : null}
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  compact,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.primaryButton, compact && styles.compactButton]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.ghostButton}>
      <Text style={styles.ghostButtonText}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{label}</Text>
    </View>
  );
}
