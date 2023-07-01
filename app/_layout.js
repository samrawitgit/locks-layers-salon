import React, { useContext } from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { AuthProvider } from "../utils/containers/auth.container";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function Layout() {
  const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    // roundness: 30,
    colors: {
      primary: "#331E6D",
      secondary: "#FFCF31",
    },
  };
  return (
    // Setup the auth context and render our layout inside of it.
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Slot />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
