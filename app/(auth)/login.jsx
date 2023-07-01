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
import {
  useTheme,
  Button,
  TextInput,
  SegmentedButtons,
} from "react-native-paper";

import { AuthContext } from "../../utils/containers/auth.container";

function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { login, register } = useContext(AuthContext);

  const [loginView, setLoginView] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const onLogin = async () => {
    const res = await login(email, password);
    if (res && res.error) {
      console.log(res.msg);
      alert(res.msg);
    }
  };

  const onRegister = async () => {
    const res = await register(email, password);
    if (res && res.error) {
      console.log(res.msg);
      alert(res.msg);
    } else {
      setEmail("");
      setPassword("");
      setLoginView(true);
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
        backgroundColor: "#331e6ddb",
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

          <SegmentedButtons
            value={loginView}
            onValueChange={(val) => {
              setLoginView(val);
              setPassword(""), setConfirmPassword("");
            }}
            buttons={[
              {
                value: true,
                label: "Login",
                // checkedColor: theme.colors.secondary,
                style: {
                  backgroundColor: loginView
                    ? theme.colors.secondary
                    : theme.colors.primary,
                },
                uncheckedColor: theme.colors.secondary,
              },
              {
                value: false,
                label: "Register",
                style: {
                  backgroundColor: !loginView
                    ? theme.colors.secondary
                    : theme.colors.primary,
                },
                uncheckedColor: theme.colors.secondary,
                // checkedColor: theme.colors.secondary,
              },
            ]}
            style={{ marginBottom: 25 }}
          />

          <View sx={{ width: "70%" }}>
            {loginView ? (
              <>
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
              </>
            ) : (
              <>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={(txt) => setName(txt)}
                  style={{
                    backgroundColor: "#e0e0e0",
                    marginBottom: 50,
                    borderRadius: 4,
                  }}
                  // theme={{ roundness: 3 }}
                />
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
                    marginBottom: 50,
                    borderRadius: 4,
                  }}
                />
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(txt) => setConfirmPassword(txt)}
                  secureTextEntry={true}
                  // right={
                  //   <TextInput.Icon
                  //     icon="eye"
                  //     onPress={(e) => setShowPassword((prev) => !prev)}
                  //   />
                  // }
                  style={{
                    backgroundColor: "#e0e0e0",
                    // marginBottom: 50,
                    borderRadius: 4,
                  }}
                />
              </>
            )}
          </View>
          <Button
            onPress={loginView ? onLogin : onRegister}
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
