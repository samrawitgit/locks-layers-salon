import { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

import { AuthContext } from "../utils/containers/auth.container";
import { useHttpClient } from "../utils/hooks/httpClient";
import Home from "./home";
import BottomNavigator from "../components/BottomNavigator";
import { Slot } from "expo-router";

export default function Index() {
  const { authState, logout } = useContext(AuthContext);
  const { isLoading } = useHttpClient();

  if (isLoading) {
    // TODO: show loading screen then hide
    // return <AppLoading />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {authState.authenticated && (
        <>
          <Slot />
          <BottomNavigator />
        </>
      )}
    </View>
  );
}
