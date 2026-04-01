import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { AccessSettings, DeviceSession, ProtectedRole, Role } from "../types/stagehand";

const SESSION_KEY = "stagehand-device-session-v2";

type WorkspaceShellState = "hydrating" | "setup" | "locked" | "active";

export function useWorkspaceSession() {
  const [deviceSession, setDeviceSession] = useState<DeviceSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<DeviceSession>;
          if (
            parsed.role === "manager" ||
            parsed.role === "member" ||
            parsed.role === "crowd"
          ) {
            const nextSession: DeviceSession = {
              role: parsed.role,
              provisionedAt:
                typeof parsed.provisionedAt === "number" ? parsed.provisionedAt : Date.now(),
            };
            setDeviceSession(nextSession);
            setIsUnlocked(nextSession.role === "crowd");
          }
        }
      } catch (error) {
        console.warn("Unable to hydrate workspace session", error);
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  const persistSession = async (nextSession: DeviceSession | null) => {
    if (!nextSession) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return;
    }

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const provisionRole = async (role: Role) => {
    const nextSession: DeviceSession = {
      role,
      provisionedAt: Date.now(),
    };

    setDeviceSession(nextSession);
    setIsUnlocked(true);
    await persistSession(nextSession);
  };

  const clearDeviceSession = async () => {
    setDeviceSession(null);
    setIsUnlocked(false);
    await persistSession(null);
  };

  const lockWorkspace = () => {
    if (!deviceSession || deviceSession.role === "crowd") {
      return;
    }

    setIsUnlocked(false);
  };

  const validatePasscode = (role: ProtectedRole, passcode: string, access: AccessSettings) => {
    const expectedPasscode = role === "manager" ? access.managerPin : access.memberPin;
    return passcode.trim() === expectedPasscode;
  };

  const unlockWorkspace = async (passcode: string, access: AccessSettings) => {
    if (!deviceSession || deviceSession.role === "crowd") {
      return false;
    }

    if (!validatePasscode(deviceSession.role, passcode, access)) {
      return false;
    }

    setIsUnlocked(true);
    return true;
  };

  const exitCrowdMode = async (managerPasscode: string, access: AccessSettings) => {
    if (deviceSession?.role !== "crowd") {
      return false;
    }

    if (!validatePasscode("manager", managerPasscode, access)) {
      return false;
    }

    await clearDeviceSession();
    return true;
  };

  let shellState: WorkspaceShellState = "hydrating";
  let activeRole: Role | null = null;

  if (hydrated) {
    if (!deviceSession) {
      shellState = "setup";
    } else if (deviceSession.role === "crowd") {
      shellState = "active";
      activeRole = "crowd";
    } else if (isUnlocked) {
      shellState = "active";
      activeRole = deviceSession.role;
    } else {
      shellState = "locked";
    }
  }

  return {
    activeRole,
    clearDeviceSession,
    deviceSession,
    exitCrowdMode,
    hydrated,
    lockWorkspace,
    provisionRole,
    shellState,
    unlockWorkspace,
  };
}
