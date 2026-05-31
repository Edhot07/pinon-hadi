import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMember } from "../hooks/profile_section";

const PersonalInfo = () => {
  const { data: member, isLoading } = useMember();
  console.log(member?.contact?.addresses);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const primaryPhone = member?.contact?.phones?.[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#185FA5" />
          <Text style={styles.backText}>Profile</Text>
        </TouchableOpacity>
        <Text variant="titleSmall" style={styles.headerTitle}>
          Personal info
        </Text>
        <TouchableOpacity onPress={() => router.push("/profile/edit")}>
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <SectionLabel title="Basic info" />
        <View style={styles.card}>
          <InfoRow
            icon="person-outline"
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            label="First name"
            value={member?.contact?.firstName}
          />
          <InfoRow
            icon="person-outline"
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            label="Last name"
            value={member?.contact?.lastName}
          />
          <InfoRow
            icon="pricetag-outline"
            iconBg="#EAF3DE"
            iconColor="#3B6D11"
            label="Nickname"
            value={member?.profile?.nickname}
            isLast
          />
        </View>
        {/* Contact */}
        <SectionLabel title="Contact" />
        <View style={styles.card}>
          <InfoRow
            icon="mail-outline"
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            label="Email"
            value={member?.loginEmail}
            badge="Primary"
            badgeColor="blue"
          />
          <InfoRow
            icon="phone-portrait-outline"
            iconBg="#FAEEDA"
            iconColor="#854F0B"
            label={`Phone${primaryPhone ? " · Mobile" : ""}`}
            value={primaryPhone}
            badge={primaryPhone ? "Primary" : undefined}
            badgeColor="gray"
          />
          {!primaryPhone && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push("/profile/edit")}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={18} color="#185FA5" />
              </View>
              <Text style={styles.addBtnText}>Add phone number</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Addresses */}
        {member?.contact?.addresses?.length ? (
          member.contact.addresses.map((addr, index) => (
            <View
              key={index}
              style={[
                styles.addressRow,
                index < member.contact!.addresses!.length - 1 &&
                  styles.rowBorder,
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: "#EAF3DE" }]}>
                <Ionicons name="location-outline" size={16} color="#3B6D11" />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.rowLabel}>Address {index + 1}</Text>
                {addr.addressLine && (
                  <Text style={styles.addressText}>{addr.addressLine}</Text>
                )}
                {addr.addressLine2 && (
                  <Text style={styles.addressText}>{addr.addressLine2}</Text>
                )}
                <Text style={styles.addressText}>
                  {[addr.city, addr.subdivision, addr.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                {addr.country && (
                  <Text style={styles.addressText}>{addr.country}</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.addressRow}>
            <View style={[styles.iconBox, { backgroundColor: "#EAF3DE" }]}>
              <Ionicons name="location-outline" size={16} color="#3B6D11" />
            </View>
            <View>
              <Text style={styles.rowLabel}>Home address</Text>
              <Text style={styles.emptyValue}>Not added</Text>
            </View>
          </View>
        )}
        {/* Account */}
        <SectionLabel title="Account" />
        <View style={styles.card}>
          <InfoRow
            icon="checkmark-circle-outline"
            iconBg="#EAF3DE"
            iconColor="#3B6D11"
            label="Account status"
            value={member?.activityStatus === "ACTIVE" ? "Active" : "Inactive"}
          />
          <InfoRow
            icon="shield-checkmark-outline"
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            label="Email verified"
            value={member?.loginEmailVerified ? "Verified" : "Not verified"}
            badge={member?.loginEmailVerified ? "✓" : undefined}
            badgeColor="blue"
          />
          <InfoRow
            icon="time-outline"
            iconBg="#F1EFE8"
            iconColor="#5F5E5A"
            label="Last login"
            value={formatDate(member?.lastLoginDate || "")}
          />
          <InfoRow
            icon="calendar-outline"
            iconBg="#F1EFE8"
            iconColor="#5F5E5A"
            label="Member since"
            value={formatDate(member?._createdDate || "")}
            isLast
          />
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Reusable Components ──────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

interface InfoRowProps {
  icon: any;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string | null;
  badge?: string;
  badgeColor?: "blue" | "gray" | "green";
  isLast?: boolean;
}

function InfoRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor = "blue",
  isLast,
}: InfoRowProps) {
  const badgeStyles = {
    blue: { bg: "#E6F1FB", text: "#0C447C" },
    gray: { bg: "#F1EFE8", text: "#5F5E5A" },
    green: { bg: "#EAF3DE", text: "#27500A" },
  };

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text
          style={[styles.rowValue, !value && styles.emptyValue]}
          numberOfLines={1}
        >
          {value ?? "Not added"}
        </Text>
      </View>
      {badge && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeStyles[badgeColor].bg },
          ]}
        >
          <Text
            style={[styles.badgeText, { color: badgeStyles[badgeColor].text }]}
          >
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { fontSize: 14, color: "#185FA5" },
  headerTitle: { fontWeight: "500" },
  editBtn: { fontSize: 14, color: "#185FA5" },

  // Section
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowContent: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 11, color: "#888", marginBottom: 2 },
  rowValue: { fontSize: 14, color: "#000" },
  emptyValue: { fontSize: 14, color: "#bbb", fontStyle: "italic" },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    flexShrink: 0,
  },
  badgeText: { fontSize: 10, fontWeight: "500" },

  // Address
  addressRow: {
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  addressContent: { flex: 1 },
  addressText: { fontSize: 14, color: "#000", lineHeight: 20 },

  // Add button
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#f0f0f0",
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 14, color: "#185FA5" },
});

export default PersonalInfo;
