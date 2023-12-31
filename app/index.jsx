import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

import { AuthContext } from "../utils/containers/auth.container";
import { useHttpClient } from "../utils/hooks/httpClient";
// import Home from "./home";
import BottomNavigator from "../components/BottomNavigator";
import { Slot } from "expo-router";

export default function Index() {
  const { authenticated, logout } = useContext(AuthContext);
  const { isLoading } = useHttpClient();

  if (isLoading) {
    // TODO: show loading screen then hide
    // return <AppLoading />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <>
        <Slot />
        {authenticated && <BottomNavigator />}
      </>
    </View>
  );
}
