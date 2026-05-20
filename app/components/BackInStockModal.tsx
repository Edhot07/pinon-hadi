// components/BackInStockModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Product } from "../(tabs)";
import { useCreateBackInStockNotificationRequest } from "../hooks/FetchProducts";

interface BackInStockModalProps {
  visible: boolean;
  onDismiss: () => void;
  product: Product | undefined;
  selectedOptions: Record<string, string>;
}

const BackInStockModal = ({
  visible,
  onDismiss,
  product,
  selectedOptions,
}: BackInStockModalProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  //   const [isSuccess, setIsSuccess] = useState(false);
  //   const [isLoading, setIsLoading] = useState(false);

  const selectedVariantLabel = Object.values(selectedOptions).join(" · ");

  const mutation = useCreateBackInStockNotificationRequest();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    try {
      mutation.mutate({
        email,
        itemUrl:
          process.env.EXPO_PUBLIC_BASE_URL + `/products/${product?.slug}`,
        product,
        selectedOptions,
      });
      // ← Your mutation goes here
      // await subscribeBackInStock({ email, product, selectedOptions });
    } catch (error) {
      setEmailError("Something went wrong. Please try again.");
    }
  };

  const handleDismiss = () => {
    setEmail("");
    setEmailError("");
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide" // ← slides up from bottom
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      {/* Backdrop — tap to dismiss */}
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <Surface
          style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
          elevation={5}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.headerTitle}>
                {mutation.isSuccess
                  ? "You're on the list!"
                  : "Notify me when available"}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.outline, marginTop: 2 }}
              >
                {mutation.isSuccess
                  ? "We'll email you as soon as it's back in stock."
                  : "Get notified when this item is restocked."}
              </Text>
            </View>

            {/* Close Button */}
            <Pressable
              onPress={handleDismiss}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons
                name="close"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>

          {/* Product Pill */}
          <View style={styles.productPill}>
            <View style={styles.productPillInner}>
              <View>
                <Text variant="labelLarge" numberOfLines={1}>
                  {product?.name}
                </Text>
                {!!selectedVariantLabel && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    {selectedVariantLabel}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of stock</Text>
            </View>
          </View>

          {/* Success State */}
          {mutation.isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={32} color="#3B6D11" />
              </View>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.outline, textAlign: "center" }}
              >
                We'll notify {email} when{"\n"}
                <Text
                  style={{ fontWeight: "700", color: theme.colors.onSurface }}
                >
                  {product?.name}
                </Text>{" "}
                is back.
              </Text>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.doneButton}
                labelStyle={{ fontWeight: "600" }}
              >
                Done
              </Button>
            </View>
          ) : (
            /* Form State */
            <View style={styles.form}>
              <TextInput
                label="Email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={!!emailError}
                outlineStyle={{ borderRadius: 12 }}
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon="email-outline"
                    color={theme.colors.outline}
                  />
                }
              />
              {!!emailError && (
                <HelperText type="error" visible={!!emailError}>
                  {emailError}
                </HelperText>
              )}

              <Text
                variant="bodySmall"
                style={[styles.hint, { color: theme.colors.outline }]}
              >
                You'll only receive one email when this item is restocked. No
                spam, ever.
              </Text>

              <Button
                mode="contained"
                buttonColor="#000"
                onPress={handleSubmit}
                loading={mutation.isPending}
                disabled={mutation.isPending}
                icon="bell-outline"
                contentStyle={{ height: 50, flexDirection: "row-reverse" }}
                labelStyle={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#fff",
                }}
                style={styles.submitButton}
              >
                {mutation.isPending ? "Subscribing..." : "Notify me"}
              </Button>
            </View>
          )}
        </Surface>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  keyboardAvoid: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  // Handle
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#d0d0d0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontWeight: "700",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Product Pill
  productPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  productPillInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  outOfStockBadge: {
    backgroundColor: "#FCEBEB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#A32D2D",
  },

  // Form
  form: {
    gap: 4,
  },
  input: {
    backgroundColor: "#fff",
  },
  hint: {
    lineHeight: 16,
    marginTop: 4,
    marginHorizontal: 2,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 12,
  },

  // Success
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EAF3DE",
    alignItems: "center",
    justifyContent: "center",
  },
  doneButton: {
    marginTop: 8,
    borderRadius: 12,
    borderColor: "#000",
    width: "100%",
  },
});

export default BackInStockModal;
