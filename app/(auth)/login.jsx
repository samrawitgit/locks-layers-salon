import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../utils/containers/auth.container";

function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 28 }}>Login form goes here</Text>
      <Text onPress={() => login()} style={{ fontSize: 28 }}>
        Login
      </Text>
    </View>
  );
}

export default LoginScreen;
