import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit"
        options={{
          headerShown: false, // This hides the header completely for Edit Profile
        }}
      />
      <Stack.Screen
        name="personal-info"
        options={{
          title: "Personal Info", // This keeps the header/back button for this screen
          headerShown: false,
        }}
      />
    </Stack>
  );
}
