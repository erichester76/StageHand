import { StyleSheet } from "react-native";

import { colors } from "../constants/theme";

export const appStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 18,
  },
  hero: {
    gap: 16,
  },
  heroMain: {
    backgroundColor: colors.panel,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 12,
  },
  heroBody: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  heroStats: {
    gap: 12,
  },
  heroStatsTablet: {
    flexDirection: "row",
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  metricValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  metricDetail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  eyebrow: {
    color: colors.accentDeep,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  roleButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  roleButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  roleButtonTextActive: {
    color: "#fffaf2",
  },
  workspaceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.panel,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  workspaceHeaderCopy: {
    flex: 1,
  },
  workspaceActionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
  },
  workspaceTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionStack: {
    gap: 16,
  },
  sectionHeader: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    padding: 18,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  cardHeaderCopy: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  sidePill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sidePillGood: {
    backgroundColor: "#e5f3e8",
  },
  sidePillWarning: {
    backgroundColor: "#f7edd3",
  },
  sidePillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  sidePillTextGood: {
    color: colors.success,
  },
  sidePillTextWarning: {
    color: colors.warning,
  },
  stackGap: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fffaf3",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  inlineAllocation: {
    minWidth: 72,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  compactButton: {
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#fffaf2",
    fontWeight: "800",
    fontSize: 14,
  },
  ghostButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ocean,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.oceanSoft,
  },
  ghostButtonText: {
    color: colors.ocean,
    fontWeight: "700",
    fontSize: 13,
  },
  rowCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
    gap: 12,
  },
  rowMeta: {
    gap: 4,
    flex: 1,
  },
  rowAside: {
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  rowTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  rowSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  noteText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  moneyText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: "800",
  },
  subheading: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  togglePill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  togglePillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  togglePillText: {
    color: colors.text,
    fontWeight: "700",
  },
  togglePillTextActive: {
    color: "#fffaf2",
  },
  selectPill: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  selectPillActive: {
    backgroundColor: colors.ocean,
    borderColor: colors.ocean,
  },
  selectPillText: {
    color: colors.text,
    fontWeight: "700",
  },
  selectPillTextActive: {
    color: "#f4fbff",
  },
  requestCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 16,
    gap: 10,
  },
  requestTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestValuePill: {
    borderRadius: 999,
    backgroundColor: colors.oceanSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requestValuePillText: {
    color: colors.ocean,
    fontSize: 12,
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    padding: 18,
    backgroundColor: "#fffaf3",
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  leadCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  personPill: {
    minWidth: 132,
    borderRadius: 18,
    padding: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  personPillTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  personPillSubtitle: {
    color: colors.muted,
    fontSize: 13,
  },
  crowdColumns: {
    gap: 16,
  },
  crowdColumnsTablet: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  crowdLeftColumn: {
    flex: 1,
    gap: 16,
  },
  crowdRightColumn: {
    flex: 1.15,
    gap: 16,
  },
  launchRoleGrid: {
    gap: 12,
  },
  launchRoleCard: {
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  launchRoleCardActive: {
    backgroundColor: colors.ocean,
    borderColor: colors.ocean,
  },
  launchRoleEyebrowActive: {
    color: "#cfe6ef",
  },
  launchRoleTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  launchRoleTitleActive: {
    color: "#f4fbff",
  },
  launchRoleBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  launchRoleBodyActive: {
    color: "#d9edf4",
  },
  errorText: {
    color: colors.accentDeep,
    fontSize: 14,
    fontWeight: "700",
  },
  helperText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(22, 30, 36, 0.54)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  modalBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  linkCard: {
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
  },
  linkCardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  linkCardValue: {
    color: colors.accentDeep,
    fontSize: 13,
  },
});
