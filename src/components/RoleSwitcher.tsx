import React from "react";
import { Pressable, Text, View } from "react-native";

import { appStyles as styles } from "../styles/appStyles";
import { Role } from "../types/stagehand";

export function RoleSwitcher({
  selectedRole,
  onSelectRole,
}: {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
}) {
  const roles: { id: Role; label: string }[] = [
    { id: "manager", label: "Manager" },
    { id: "member", label: "Band Member" },
    { id: "crowd", label: "Crowd Tablet" },
  ];

  return (
    <View style={styles.roleRow}>
      {roles.map((role) => (
        <Pressable
          key={role.id}
          onPress={() => onSelectRole(role.id)}
          style={[styles.roleButton, selectedRole === role.id && styles.roleButtonActive]}
        >
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === role.id && styles.roleButtonTextActive,
            ]}
          >
            {role.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
