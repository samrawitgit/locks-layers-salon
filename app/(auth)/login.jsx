import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
} from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useTheme, Button, TextInput } from "react-native-paper";

import { AuthContext } from "../../utils/containers/auth.container";

function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(true);

  const onLogin = async () => {
    const res = await login(email, password);
    if (res && res.error) {
      console.log(res.msg);
      alert(res.msg);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // height: "100%",
        paddingTop: insets.top,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: theme.colors.primary,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 32 }}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <Pressable>
          {/* <View className="page"> */}
          <View>
            <Image
              source={require("@assets/icon.png")}
              style={{ width: 200, height: 200 }}
            />
          </View>
          {/* <Text style={{ fontSize: 28 }}>Login form goes here</Text> */}

          <View sx={{ width: "70%" }}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(txt) => setEmail(txt)}
              style={{
                backgroundColor: "#e0e0e0",
                marginBottom: 50,
                borderRadius: 4,
              }}
              // theme={{ roundness: 3 }}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(txt) => setPassword(txt)}
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={(e) => setShowPassword((prev) => !prev)}
                />
              }
              style={{
                backgroundColor: "#e0e0e0",
                // marginBottom: 50,
                borderRadius: 4,
              }}
            />
          </View>
          <Button
            onPress={onLogin}
            mode="contained"
            uppercase
            // dark
            style={{
              marginTop: 50,
              width: 200,
              height: 45,
              justifyContent: "center",
            }}
            buttonColor={theme.colors.secondary}
            labelStyle={{ fontSize: 20, fontWeight: "bold" }}
          >
            Login
          </Button>
          {/* </View> */}
        </Pressable>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
