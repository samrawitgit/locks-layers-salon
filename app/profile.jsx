import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  BottomNavigation,
  Button,
  Card,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Pressable } from "react-native";
import { AuthContext } from "../utils/containers/auth.container";
import { View } from "react-native-web";

const Profile = () => {
  const theme = useTheme();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    //fetch user data
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        // justifyContent: "flex-end",
        // backgroundColor: theme.colors.background,
        color: theme.colors.text,
        width: "100vw",
      }}
    >
      <View style={{ height: "50vh", justifyContent: "space-evenly" }}>
        <Card mode="contained" style={{ padding: 15 }}>
          <Card.Content style={{ height: "20vh", flexDirection: "row" }}>
            <Avatar.Text label="XD" />
            <View
              style={{
                flexDirection: "column",
                marginLeft: "30px",
                justifyContent: "space-evenly",
              }}
            >
              <Text>Name</Text>
              <Text>Email</Text>
              <Text>Telephone</Text>
              <Text>City</Text>
            </View>
          </Card.Content>
        </Card>
        <Button
          onPress={() => logout()}
          mode="contained"
          uppercase
          dark
          style={{
            width: 150,
            height: 50,
            alignSelf: "center",
            marginTop: 50,
            justifyContent: "center",
          }}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
