import { View, Text } from "react-native";
import { Button } from "react-native-paper";

import { AuthContext } from "../utils/containers/auth.container";
import { useContext } from "react";
import LoginScreen from "./(auth)/login";

export default function Index() {
  const { authState, logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {authState.authenticated && (
        <Button onPress={() => logout()} mode="contained" uppercase dark>
          Sign Out
        </Button>
      )}
    </View>
  );
}
