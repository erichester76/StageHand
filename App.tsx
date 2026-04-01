import React from "react";
import { SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { GhostButton, MetricCard } from "./src/components/ui";
import { useStageHandState } from "./src/hooks/useStageHandState";
import { useWorkspaceSession } from "./src/hooks/useWorkspaceSession";
import { CrowdView } from "./src/screens/CrowdView";
import { LaunchScreen } from "./src/screens/LaunchScreen";
import { ManagerView } from "./src/screens/ManagerView";
import { MemberView } from "./src/screens/MemberView";
import { appStyles as styles } from "./src/styles/appStyles";

function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const stagehand = useStageHandState();
  const session = useWorkspaceSession();

  const activeRole = session.activeRole;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
        <View style={styles.hero}>
          <View style={styles.heroMain}>
            <Text style={styles.eyebrow}>Unified band operations</Text>
            <Text style={styles.heroTitle}>StageHand</Text>
            <Text style={styles.heroBody}>
              One mobile app for the manager, the band, and the room. The crowd experience expands
              into a tablet-first layout so request taking and tipping can live beside the stage or
              merch table.
            </Text>
          </View>

          <View style={[styles.heroStats, isTablet && styles.heroStatsTablet]}>
            <MetricCard
              label="Songs ready"
              value={`${stagehand.state.songs.length}`}
              detail="Live request catalog"
            />
            <MetricCard
              label="Queued requests"
              value={`${stagehand.sortedRequests.length}`}
              detail="Room demand right now"
            />
            <MetricCard
              label="Tonight's tips"
              value={stagehand.helpers.formatCurrency(stagehand.totalTips)}
              detail={
                stagehand.activeShow
                  ? `${stagehand.activeShow.venue} · ${stagehand.activeShow.city}`
                  : "No active show"
              }
            />
          </View>
        </View>

        {session.hydrated && activeRole ? (
          <View style={styles.workspaceHeader}>
            <View style={styles.workspaceHeaderCopy}>
              <Text style={styles.eyebrow}>Current workspace</Text>
              <Text style={styles.workspaceTitle}>
                {activeRole === "crowd"
                  ? stagehand.state.access.crowdLabel || "Crowd tablet"
                  : activeRole === "manager"
                    ? "Manager"
                    : "Band member"}
              </Text>
            </View>
            <GhostButton
              label="Change device mode"
              onPress={() => {
                void session.setActiveRole(null);
              }}
            />
          </View>
        ) : null}

        {session.hydrated && !activeRole ? (
          <LaunchScreen
            access={stagehand.state.access}
            onEnterRole={(role) => session.setActiveRole(role)}
          />
        ) : null}

        {activeRole === "manager" ? (
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

        {activeRole === "member" ? (
          <MemberView
            activeShow={stagehand.activeShow}
            helpers={stagehand.helpers}
            sortedRequests={stagehand.sortedRequests}
            state={stagehand.state}
            totalTips={stagehand.totalTips}
          />
        ) : null}

        {activeRole === "crowd" ? (
          <CrowdView
            activeShow={stagehand.activeShow}
            bandName={stagehand.state.bandName}
            boostRequest={stagehand.actions.boostRequest}
            helpers={stagehand.helpers}
            isTablet={isTablet}
            links={stagehand.state.links}
            addRequest={(payload) => stagehand.actions.addRequest(payload)}
            addSupportTip={(payload) => stagehand.actions.addSupportTip(payload)}
            songs={stagehand.state.songs}
            sortedRequests={stagehand.sortedRequests}
            supportTips={stagehand.state.supportTips}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
