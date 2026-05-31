import {
  addressSchema,
  AddressValues,
  ProfileFormValues,
  profileSchema,
} from "@/lib/validations/profileSchema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressForm } from "../components/AddressForm";
import { useMember, useUpdateMember } from "../hooks/profile_section";

const EditProfile = () => {
  const { data: member, isLoading } = useMember();
  const { mutate: update, isPending } = useUpdateMember();
  const [avatarUri, setAvatarUri] = useState<string | null>(
    member?.profile?.photo?.url ?? null,
  );

  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  //Addresses
  const [addresses, setAddresses] = useState<AddressValues[]>([]);
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof AddressValues, string>>[]
  >([]);

  useEffect(() => {
    if (member?.contact?.addresses) {
      setAddresses(
        member.contact.addresses.map((a) => ({
          addressLine: a.addressLine ?? "",
          addressLine2: a.addressLine2 ?? "",
          city: a.city ?? "",
          subdivision: a.subdivision ?? "",
          country: a.country ?? "",
          postalCode: a.postalCode ?? "",
        })),
      );
    }
  }, [member]);

  const handleAddressChange = (
    index: number,
    field: keyof AddressValues,
    value: string,
  ) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
    // ← Clear error for this field
    const updatedErrors = [...addressErrors];
    if (updatedErrors[index]) {
      updatedErrors[index] = { ...updatedErrors[index], [field]: undefined };
      setAddressErrors(updatedErrors);
    }
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        addressLine: "",
        addressLine2: "",
        city: "",
        subdivision: "",
        country: "",
        postalCode: "",
      },
    ]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
    setAddressErrors(addressErrors.filter((_, i) => i !== index));
  };

  //

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // ← values syncs once with server data without causing re-renders
    values: {
      nickname: member?.profile?.nickname ?? "",
      firstName: member?.contact?.firstName ?? "",
      lastName: member?.contact?.lastName ?? "",
      phone: member?.contact?.phones?.[0] ?? "",
    },
  });

  // ← Single source of truth for save button
  // const canSave = isDirty || !!localPhotoUri; // ← only allow save when there are changes and not already saving
  const canSave =
    isDirty ||
    !!localPhotoUri ||
    JSON.stringify(addresses) !==
      JSON.stringify(
        member?.contact?.addresses?.map((a) => ({
          addressLine: a.addressLine ?? "",
          addressLine2: a.addressLine2 ?? "",
          city: a.city ?? "",
          subdivision: a.subdivision ?? "",
          country: a.country ?? "",
          postalCode: a.postalCode ?? "",
        })) ?? [],
      );

  // ─── Avatar ───────────────────────────────────────────────
  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri); // ← show preview immediately
      setLocalPhotoUri(uri); // ← track for upload on save
    }
  };

  // ─── Submit ───────────────────────────────────────────────
  const onSubmit = (values: ProfileFormValues) => {
    if (!member?._id) return;

    // ← Validate addresses
    const addressValidationErrors: Partial<
      Record<keyof AddressValues, string>
    >[] = [];
    let hasAddressErrors = false;

    addresses.forEach((addr, i) => {
      const result = addressSchema.safeParse(addr);
      if (!result.success) {
        hasAddressErrors = true;
        const fieldErrors: Partial<Record<keyof AddressValues, string>> = {};
        result.error.issues.forEach((e) => {
          if (e.path[0])
            fieldErrors[e.path[0] as keyof AddressValues] = e.message;
        });
        addressValidationErrors[i] = fieldErrors;
      }
    });

    if (hasAddressErrors) {
      setAddressErrors(addressValidationErrors);
      return;
    }

    update(
      {
        memberId: member._id,
        values: { ...values, addresses },
        localPhotoUri,
        currentPhotoUrl: member?.profile?.photo?.url,
      },
      {
        onSuccess: () => {
          setLocalPhotoUri(null);
          router.back();
        },
        onError: () =>
          Alert.alert("Error", "Failed to update. Please try again."),
      },
    );
  };

  // ─── Back ─────────────────────────────────────────────────
  const handleBack = () => {
    if (isDirty || localPhotoUri) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure?",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setLocalPhotoUri(null);
              setAvatarUri(member?.profile?.photo?.url ?? null); // ← reset to original photo
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#185FA5" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text variant="titleSmall" style={styles.headerTitle}>
          Edit profile
        </Text>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !canSave}
          style={[styles.saveBtn, (!canSave || isPending) && { opacity: 0.4 }]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#27500A" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
              <View style={styles.avatarWrap}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>
                      {member?.profile?.nickname?.slice(0, 2).toUpperCase() ??
                        "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.avatarOverlay}>
                  {isPending && localPhotoUri ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={18} color="#fff" />
                  )}
                </View>
                {/* ← Green dot when new photo selected but not saved yet */}
                {localPhotoUri && !isPending && (
                  <View style={styles.photoPendingDot} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Profile */}
          <SectionLabel title="Profile" />
          <View style={styles.section}>
            <Controller
              control={control}
              name="nickname"
              render={({ field: { value, onChange, onBlur } }) => (
                <FieldInput
                  label="Nickname"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Your display name"
                  autoCapitalize="words"
                  error={errors.nickname?.message}
                />
              )}
            />
          </View>

          {/* Personal Info */}
          <SectionLabel title="Personal info" />
          <View style={styles.section}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { value, onChange, onBlur } }) => (
                <FieldInput
                  label="First name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="First name"
                  autoCapitalize="words"
                  error={errors.firstName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange, onBlur } }) => (
                <FieldInput
                  label="Last name"
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Last name"
                  autoCapitalize="words"
                  error={errors.lastName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange, onBlur } }) => (
                <FieldInput
                  label="Phone (add +91 followed by your number)"
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Add phone number with Country code"
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                  isLast
                />
              )}
            />
          </View>

          {/* Addresses Section */}
          <SectionLabel title="Addresses" />
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {addresses.length === 0 && (
              <View style={styles.emptyAddress}>
                <Ionicons name="location-outline" size={20} color="#aaa" />
                <Text style={styles.emptyAddressText}>
                  No addresses added yet
                </Text>
              </View>
            )}

            {addresses.map((address, index) => (
              <AddressForm
                key={index}
                index={index}
                address={address}
                onChange={handleAddressChange}
                onRemove={handleRemoveAddress}
                errors={addressErrors[index]}
              />
            ))}

            {/* Add Address Button */}
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={handleAddAddress}
            >
              <View style={styles.addAddressIcon}>
                <Ionicons name="add" size={20} color="#185FA5" />
              </View>
              <Text style={styles.addAddressBtnText}>Add address</Text>
            </TouchableOpacity>
          </View>

          {/* Account readonly */}
          <SectionLabel title="Account" />
          <View style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldReadonly}>
                {member?.loginEmail ?? "—"}
              </Text>
              <Text style={styles.fieldHint}>Email cannot be changed here</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.footerSaveBtn,
                (isPending || !canSave) && { opacity: 0.4 },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending || !canSave}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.footerSaveBtnText}>Save changes</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.footerHint}>
              Only you can see your personal info
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── FieldInput ───────────────────────────────────────────────

interface FieldInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  isLast?: boolean;
}

function FieldInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  isLast,
}: FieldInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[fieldStyles.wrap, !isLast && fieldStyles.border]}>
      <Text
        style={[
          fieldStyles.label,
          focused && fieldStyles.labelFocused,
          !!error && fieldStyles.labelError,
        ]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          onBlur();
          setFocused(false);
        }}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[
          fieldStyles.input,
          focused && fieldStyles.inputFocused,
          !!error && fieldStyles.inputError,
        ]}
      />
      {!!error && <Text style={fieldStyles.errorText}>{error}</Text>}
    </View>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

const fieldStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 10 },
  border: { borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  label: { fontSize: 11, color: "#888", marginBottom: 4 },
  labelFocused: { color: "#185FA5" },
  labelError: { color: "#A32D2D" },
  input: { fontSize: 15, color: "#000", paddingVertical: 2 },
  inputFocused: { borderBottomWidth: 0.5, borderBottomColor: "#185FA5" },
  inputError: { borderBottomWidth: 0.5, borderBottomColor: "#A32D2D" },
  errorText: { fontSize: 11, color: "#A32D2D", marginTop: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
  photoPendingDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B6D11",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { fontSize: 14, color: "#185FA5" },
  headerTitle: { fontWeight: "500" },
  saveBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: "#27500A" },
  avatarSection: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  avatarWrap: { position: "relative", width: 80, height: 80 },
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
  avatarFallbackText: { fontSize: 24, fontWeight: "500", color: "#185FA5" },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: { fontSize: 12, color: "#888" },
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
  section: {
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  field: { paddingHorizontal: 16, paddingVertical: 10 },
  fieldLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  fieldReadonly: { fontSize: 15, color: "#aaa", paddingVertical: 2 },
  fieldHint: { fontSize: 11, color: "#bbb", marginTop: 3 },
  footer: { padding: 16, paddingBottom: 32, gap: 8 },
  footerSaveBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  footerSaveBtnText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  footerHint: { fontSize: 11, color: "#bbb", textAlign: "center" },

  emptyAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  emptyAddressText: {
    fontSize: 14,
    color: "#aaa",
  },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  addAddressIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  addAddressBtnText: {
    fontSize: 14,
    color: "#185FA5",
    fontWeight: "500",
  },
});

export default EditProfile;
