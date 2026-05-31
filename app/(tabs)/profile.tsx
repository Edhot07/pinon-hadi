import { isLoggedIn } from "@/lib/wixAuth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../context/AuthContext";
import useAuth from "../hooks/auth";
import { useMember } from "../hooks/profile_section";
import useLogout from "../hooks/useLogout";

const Profile = () => {
  const { login } = useAuth();
  const { isMember } = useAuthContext();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: member, isLoading: isMemberLoading } = useMember();

  if (!isLoggedIn()) {
    return <GuestScreen onLogin={login} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => router.push("/profile/edit")}>
          <Text style={styles.editButton}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        {isMemberLoading ? (
          <View style={styles.heroLoading}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <View style={styles.hero}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              {member?.profile?.photo?.url ? (
                <Image
                  source={member.profile.photo.url}
                  contentFit="cover"
                  priority="high"
                  cachePolicy="memory-disk" // ← caches on disk, survives app restart
                  placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                  style={styles.avatar}
                  transition={200} // ← smooth fade in
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>
                    {member?.profile?.nickname?.slice(0, 2).toUpperCase() ??
                      "?"}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.avatarEditBtn}>
                <Ionicons name="camera-outline" size={14} color="#444" />
              </TouchableOpacity>
            </View>

            {/* Name & Email */}
            <Text variant="titleLarge" style={styles.memberName}>
              {member?.profile?.nickname ?? "Member"}
            </Text>
            <Text variant="bodySmall" style={styles.memberEmail}>
              {member?.loginEmail ?? ""}
            </Text>

            {/* Badges */}
            <View style={styles.badgeRow}>
              {member?.activityStatus === "ACTIVE" && (
                <View style={[styles.badge, styles.badgeGreen]}>
                  <Text style={styles.badgeGreenText}>Active</Text>
                </View>
              )}
              {member?.loginEmailVerified && (
                <View style={[styles.badge, styles.badgeBlue]}>
                  <Text style={styles.badgeBlueText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Account Section */}
        <SectionTitle title="Account" />
        <View style={styles.section}>
          <SectionRow
            icon="person-outline"
            iconColor="#185FA5"
            iconBg="#E6F1FB"
            label="Personal info"
            subtitle="Name, phone, address"
            onPress={() => router.push("/profile/personal-info")}
          />
          <SectionRow
            icon="cube-outline"
            iconColor="#3B6D11"
            iconBg="#EAF3DE"
            label="My orders"
            subtitle="Track and manage orders"
            onPress={() => router.push("/orders")}
          />
          <SectionRow
            icon="heart-outline"
            iconColor="red"
            iconBg="#FAEEDA"
            label="Wishlist"
            subtitle="Saved items"
            onPress={() => router.push("/wishlist")}
            isLast
          />
        </View>

        {/* Preferences Section */}
        <SectionTitle title="Preferences" />
        <View style={styles.section}>
          <SectionRow
            icon="notifications-outline"
            iconColor="#185FA5"
            iconBg="#E6F1FB"
            label="Notifications"
            subtitle="Push, email alerts"
            onPress={() => router.push("/profile/notifications")}
          />
          <SectionRow
            icon="lock-closed-outline"
            iconColor="#854F0B"
            iconBg="#FAEEDA"
            label="Privacy & security"
            subtitle="Password, data settings"
            onPress={() => router.push("/profile/privacy")}
            isLast
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && { opacity: 0.6 }]}
          onPress={() => logout()}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <ActivityIndicator size="small" color="#A32D2D" />
              <Text style={styles.logoutText}>Signing out...</Text>
            </>
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color="#A32D2D" />
              <Text style={styles.logoutText}>Sign out</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>v1.0.0 · Pinon Hadi</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Guest Screen ─────────────────────────────────────────────

function GuestScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <SafeAreaView style={styles.guestContainer}>
      <View style={styles.guestContent}>
        <View style={styles.guestIconCircle}>
          <Ionicons name="person-outline" size={40} color="#185FA5" />
        </View>
        <Text variant="titleLarge" style={styles.guestTitle}>
          Sign in to your account
        </Text>
        <Text variant="bodySmall" style={styles.guestSubtitle}>
          View your orders, wishlist and manage your profile
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Reusable Components ──────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

interface SectionRowProps {
  icon: any;
  iconColor: string;
  iconBg: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
  value?: string;
}

function SectionRow({
  icon,
  iconColor,
  iconBg,
  label,
  subtitle,
  onPress,
  isLast,
  value,
}: SectionRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <View>
          <Text variant="bodyMedium" style={styles.rowLabel}>
            {label}
          </Text>
          <Text variant="bodySmall" style={styles.rowSub}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        {value && (
          <Text variant="bodySmall" style={styles.rowValue}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={16} color="#aaa" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "600",
  },
  editButton: {
    fontSize: 14,
    color: "#185FA5",
  },

  // Hero
  hero: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    gap: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  heroLoading: {
    backgroundColor: "#fff",
    padding: 60,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  // Avatar
  avatarWrap: {
    position: "relative",
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#185FA5",
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Member info
  memberName: {
    fontWeight: "600",
    marginTop: 4,
  },
  memberEmail: {
    color: "#888",
  },

  // Badges
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeGreen: {
    backgroundColor: "#EAF3DE",
  },
  badgeGreenText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#27500A",
  },
  badgeBlue: {
    backgroundColor: "#E6F1FB",
  },
  badgeBlueText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0C447C",
  },

  // Section
  sectionTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  section: {
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontWeight: "500",
  },
  rowSub: {
    color: "#888",
    marginTop: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowValue: {
    color: "#888",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#A32D2D",
  },

  // Version
  version: {
    textAlign: "center",
    fontSize: 11,
    color: "#bbb",
    paddingBottom: 24,
  },

  // Guest
  guestContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  guestContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  guestIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  guestTitle: {
    fontWeight: "600",
    textAlign: "center",
  },
  guestSubtitle: {
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default Profile;
