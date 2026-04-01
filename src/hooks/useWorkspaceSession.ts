import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Role } from "../types/stagehand";

const SESSION_KEY = "stagehand-workspace-session-v1";

export function useWorkspaceSession() {
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw === "manager" || raw === "member" || raw === "crowd") {
          setActiveRoleState(raw);
        }
      } catch (error) {
        console.warn("Unable to hydrate workspace session", error);
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  const setActiveRole = async (role: Role | null) => {
    setActiveRoleState(role);
    if (role) {
      await AsyncStorage.setItem(SESSION_KEY, role);
      return;
    }
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  return {
    activeRole,
    hydrated,
    setActiveRole,
  };
}
