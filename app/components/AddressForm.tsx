import { AddressValues } from "@/lib/validations/profileSchema";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface AddressFormProps {
  index: number;
  address: AddressValues;
  onChange: (index: number, field: keyof AddressValues, value: string) => void;
  onRemove: (index: number) => void;
  errors?: Partial<Record<keyof AddressValues, string>>;
}

export function AddressForm({
  index,
  address,
  onChange,
  onRemove,
  errors,
}: AddressFormProps) {
  return (
    <View style={styles.container}>
      {/* Address Header */}
      <View style={styles.addressHeader}>
        <View style={styles.addressHeaderLeft}>
          <Ionicons name="location-outline" size={16} color="#3B6D11" />
          <Text variant="labelLarge" style={styles.addressTitle}>
            Address {index + 1}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onRemove(index)}
          style={styles.removeBtn}
        >
          <Ionicons name="trash-outline" size={16} color="#A32D2D" />
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {/* Fields */}
      <AddressField
        label="Street address"
        value={address.addressLine}
        onChangeText={(v) => onChange(index, "addressLine", v)}
        placeholder="123 Main Street"
        error={errors?.addressLine}
        autoCapitalize="words"
      />
      <AddressField
        label="Apt, suite, etc. (optional)"
        value={address.addressLine2 ?? ""}
        onChangeText={(v) => onChange(index, "addressLine2", v)}
        placeholder="Apt 4B"
        autoCapitalize="words"
      />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <AddressField
            label="City"
            value={address.city}
            onChangeText={(v) => onChange(index, "city", v)}
            placeholder="New York"
            error={errors?.city}
            autoCapitalize="words"
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <AddressField
            label="State / Province"
            value={address.subdivision ?? ""}
            onChangeText={(v) => onChange(index, "subdivision", v)}
            placeholder="NY"
            autoCapitalize="characters"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <AddressField
            label="Postal code"
            value={address.postalCode}
            onChangeText={(v) => onChange(index, "postalCode", v)}
            placeholder="10001"
            error={errors?.postalCode}
            keyboardType="number-pad"
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <AddressField
            label="Country code"
            value={address.country}
            onChangeText={(v) => onChange(index, "country", v.toUpperCase())}
            placeholder="US"
            autoCapitalize="characters"
            error={errors?.country}
          />
        </View>
      </View>
    </View>
  );
}

interface AddressFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: any;
  autoCapitalize?: any;
}

function AddressField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
}: AddressFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldStyles.wrap}>
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
        onBlur={() => setFocused(false)}
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

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { fontSize: 11, color: "#888", marginBottom: 4 },
  labelFocused: { color: "#185FA5" },
  labelError: { color: "#A32D2D" },
  input: {
    fontSize: 14,
    color: "#000",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  inputFocused: { borderColor: "#185FA5" },
  inputError: { borderColor: "#A32D2D" },
  errorText: { fontSize: 11, color: "#A32D2D", marginTop: 3 },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  addressHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressTitle: {
    color: "#3B6D11",
    fontWeight: "500",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeBtnText: {
    fontSize: 12,
    color: "#A32D2D",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
