import React from "react";
import { SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { StaffAccessModal } from "./src/components/StaffAccessModal";
import { GhostButton } from "./src/components/ui";
import { useStageHandState } from "./src/hooks/useStageHandState";
import { useWorkspaceSession } from "./src/hooks/useWorkspaceSession";
import { CrowdView } from "./src/screens/CrowdView";
import { LaunchScreen } from "./src/screens/LaunchScreen";
import { ManagerView } from "./src/screens/ManagerView";
import { MemberView } from "./src/screens/MemberView";
import { UnlockScreen } from "./src/screens/UnlockScreen";
import { appStyles as styles } from "./src/styles/appStyles";

function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const stagehand = useStageHandState();
  const session = useWorkspaceSession();
  const [staffAccessVisible, setStaffAccessVisible] = React.useState(false);
  const appReady = stagehand.hydrated && session.hydrated;

  const activeRole = session.activeRole;
  const provisionedRole = session.deviceSession?.role ?? null;
  const shellState = appReady ? session.shellState : "hydrating";

  const workspaceTitle =
    provisionedRole === "crowd"
      ? stagehand.state.access.crowdLabel || "Crowd tablet"
      : provisionedRole === "manager"
        ? "Manager"
        : provisionedRole === "member"
          ? "Band member"
          : "Device setup";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StaffAccessModal
        visible={staffAccessVisible}
        onCancel={() => setStaffAccessVisible(false)}
        onConfirm={async (passcode) => {
          const succeeded = await session.exitCrowdMode(passcode, stagehand.state.access);
          if (succeeded) {
            setStaffAccessVisible(false);
          }
          return succeeded;
        }}
      />

      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
        {shellState === "active" && activeRole !== "crowd" ? (
          <View style={[styles.workspaceHeader, !isTablet && styles.workspaceHeaderStacked]}>
            <View
              style={[
                styles.workspaceHeaderCopy,
                !isTablet && styles.workspaceHeaderCopyStacked,
              ]}
            >
              <Text style={styles.eyebrow}>Current device session</Text>
              <Text style={styles.workspaceTitle}>{workspaceTitle}</Text>
            </View>
            <View
              style={[
                styles.workspaceActionGroup,
                !isTablet && styles.workspaceActionGroupStacked,
              ]}
            >
              <GhostButton label="Lock device" onPress={session.lockWorkspace} />
              <GhostButton
                label="Change device mode"
                onPress={() => {
                  void session.clearDeviceSession();
                }}
              />
            </View>
          </View>
        ) : null}

        {shellState === "setup" ? (
          <LaunchScreen
            access={stagehand.state.access}
            onProvisionRole={(role) => session.provisionRole(role)}
          />
        ) : null}

        {shellState === "locked" && provisionedRole && provisionedRole !== "crowd" ? (
          <UnlockScreen
            role={provisionedRole}
            onUnlock={(passcode) => session.unlockWorkspace(passcode, stagehand.state.access)}
            onReprovision={() => {
              void session.clearDeviceSession();
            }}
          />
        ) : null}

        {shellState === "active" && activeRole === "manager" ? (
          <ManagerView
            activeShow={stagehand.activeShow}
            helpers={stagehand.helpers}
            splitTotal={stagehand.splitTotal}
            sortedRequests={stagehand.sortedRequests}
            state={stagehand.state}
            totalTips={stagehand.totalTips}
            actions={stagehand.actions}
          />
        ) : null}

        {shellState === "active" && activeRole === "member" ? (
          <MemberView
            activeShow={stagehand.activeShow}
            helpers={stagehand.helpers}
            sortedRequests={stagehand.sortedRequests}
            state={stagehand.state}
            totalTips={stagehand.totalTips}
          />
        ) : null}

        {shellState === "active" && activeRole === "crowd" ? (
          <CrowdView
            activeShow={stagehand.activeShow}
            bandName={stagehand.state.bandName}
            boostRequest={stagehand.actions.boostRequest}
            crowdLabel={stagehand.state.access.crowdLabel || "Crowd workspace"}
            helpers={stagehand.helpers}
            isTablet={isTablet}
            links={stagehand.state.links}
            onRequestStaffAccess={() => setStaffAccessVisible(true)}
            addRequest={(payload) => stagehand.actions.addRequest(payload)}
            addSupportTip={(payload) => stagehand.actions.addSupportTip(payload)}
            songs={stagehand.state.songs}
            sortedRequests={stagehand.sortedRequests}
            supportTips={stagehand.state.supportTips}
          />
        ) : null}

        {shellState === "hydrating" ? (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Loading session</Text>
            <Text style={styles.cardTitle}>Restoring this device</Text>
            <Text style={styles.leadCopy}>
              StageHand is checking the local device session and workspace state.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
