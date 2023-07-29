import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
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
  RadioButton,
} from "react-native-paper";

import { AuthContext } from "../../utils/containers/auth.container";
import { useRouter } from "expo-router";
import { useHttpClient } from "../../utils";

function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { login, register } = useContext(AuthContext);
  const { sendRequest, setIsLoading } = useHttpClient();

  const [loginView, setLoginView] = useState(true);
  const [allLocations, setAllLocations] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    main: true,
    confirm: true,
  });
  const [tel, setTel] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    sendRequest("/salon/locations")
      .then(({ data }) => {
        console.log({ data });
        if (!data.error) {
          setAllLocations(data.locations);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const onLogin = async () => {
    const res = await login(email, password);
    if (res && res.error) {
      console.log(res.msg);
      return alert(res.msg);
    } else {
      router.push("/");
    }
  };

  const onRegister = async () => {
    if (password.trim() !== confirmPassword.trim()) {
      alert("Passwords have to match!");
      return;
    }
    const res = await register(
      name,
      email,
      password,
      confirmPassword,
      tel,
      location
    );
    if (res && res.error) {
      console.log(res);
      alert(res.errorList ? res.errorList[0].msg : res.msg);
    } else {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTel("");
      setLocation(null);
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
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            // paddingHorizontal: 16,
            // paddingVertical: 32,
            // width: 200,
            paddingBottom: 50,
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Pressable
              style={{
                left: ["ios", "android"].includes(Platform.OS) ? -50 : "",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 50,
              }}
            >
              <View
                style={{
                  maxWidth: 500,
                  maxHeight: 250,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@assets/logo-no-background.png")}
                  style={{
                    transform: [{ scale: 0.3 }],
                  }}
                />
              </View>
              <View style={{ width: 250 }}>
                <SegmentedButtons
                  value={loginView}
                  onValueChange={(val) => {
                    setLoginView(val);
                    setPassword(""), setConfirmPassword("");
                    setShowPassword({ main: true, confirm: true });
                  }}
                  buttons={[
                    {
                      value: true,
                      label: "Login",
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

                {loginView ? (
                  <>
                    <TextInput
                      label="Email"
                      value={email}
                      keyboardType="email-address"
                      onChangeText={(txt) => setEmail(txt)}
                      style={{
                        backgroundColor: "#e0e0e0",
                        marginBottom: 50,
                        borderRadius: 4,
                      }}
                    />
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={(txt) => setPassword(txt)}
                      secureTextEntry={showPassword.main}
                      right={
                        <TextInput.Icon
                          icon={showPassword.main ? "eye" : "eye-off"}
                          onPress={(e) =>
                            setShowPassword((prev) => ({
                              ...prev,
                              main: !prev.main,
                            }))
                          }
                        />
                      }
                      style={{
                        backgroundColor: "#e0e0e0",
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
                    />
                    <TextInput
                      label="Email"
                      value={email}
                      keyboardType="email-address"
                      onChangeText={(txt) => setEmail(txt)}
                      style={{
                        backgroundColor: "#e0e0e0",
                        marginBottom: 50,
                        borderRadius: 4,
                      }}
                    />
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={(txt) => setPassword(txt)}
                      secureTextEntry={showPassword.main}
                      right={
                        <TextInput.Icon
                          icon={showPassword.main ? "eye" : "eye-off"}
                          onPress={(e) =>
                            setShowPassword((prev) => ({
                              ...prev,
                              main: !prev.main,
                            }))
                          }
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
                      secureTextEntry={showPassword.confirm}
                      right={
                        <TextInput.Icon
                          icon={showPassword.confirm ? "eye" : "eye-off"}
                          onPress={(e) =>
                            setShowPassword((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                        />
                      }
                      style={{
                        backgroundColor: "#e0e0e0",
                        marginBottom: 50,
                        borderRadius: 4,
                      }}
                    />

                    <TextInput
                      label="Telephone number"
                      value={tel}
                      onChangeText={(txt) => setTel(txt)}
                      inputMode="tel"
                      style={{
                        backgroundColor: "#e0e0e0",
                        marginBottom: 50,
                        borderRadius: 4,
                      }}
                    />

                    <RadioButton.Group
                      onValueChange={(newValue) => setLocation(newValue)}
                      value={location}
                    >
                      {allLocations.map((loc, i) => {
                        return (
                          <RadioButton.Item
                            key={`loc-radio-${i}`}
                            label={loc.city}
                            value={loc.id_location}
                            style={{ backgroundColor: "#e7e0ec" }}
                          />
                        );
                      })}
                    </RadioButton.Group>
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
                  width: 150,
                  height: 45,
                  // justifyContent: "center",
                  alignSelf: "center",
                }}
                buttonColor={theme.colors.secondary}
                labelStyle={{
                  fontSize: 18,
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {loginView ? "Login" : "Register"}
              </Button>
              {/* </View> */}
            </Pressable>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginScreen;
