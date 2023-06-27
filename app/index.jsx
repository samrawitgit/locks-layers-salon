import { View, Text } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "../utils/containers/auth.container";

export default function Index() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => logout()}>Sign Out</Text>
    </View>
  );
}
