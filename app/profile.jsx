import React, { useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
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
import { AuthContext } from "../utils/containers/auth.container";
import { Platform, View } from "react-native";
import { useHttpClient } from "../utils";

const Profile = () => {
  const theme = useTheme();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest } = useHttpClient();

  const loadUserBookings = async (userId) => {
    // console.log({ user, id: user ? user._id : "idk", userId });
    console.log({ userId });
    return sendRequest(`/user-bookings/${userId}`)
      .then(({ data, error }) => {
        if (data.error) {
          console.log(data.message);
          // return alert(data.message);
        }
        // setBookingList(data.bookings);
        // return { error: false, bookings: data.bookings };
        return data;
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    let userId;
    if (["ios", "android"].includes(Platform.OS)) {
      SecureStore.getItemAsync("userId")
        .then((res) => {
          console.log({ res });
          if (!res) {
            router.push("/login");
          }
          // userId = res; //TODO: check it works
          loadUserBookings(res)
            .then((res) => {
              console.log("ueff res", { res });
              if (res.error) {
                return alert(res.message);
              }
              // setBookingList(res.bookings);
              setUserData(res.userData);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log("no userId in scurestore", err));
    } else {
      userId = localStorage.getItem("userId");
    }

    // sendRequest(`/auth/user/${userId}`)
    //   .then(({ data }) => {
    //     if (data.error) {
    //       console.log(data.message);
    //       return alert(data.message);
    //     }
    //     // console.log({ uD: data.userData });
    //     setUserData(data.userData);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert(err);
    //     setIsLoading(false);
    //   });
  }, []);

  if (isLoading || !userData || Object.keys(userData).length < 1) {
    return <Text>Is Loading</Text>;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        // justifyContent: "flex-end",
        // backgroundColor: theme.colors.background,
        color: theme.colors.text,
        // width: "100%", //"100%", // it was vw
      }}
    >
      <View
        style={{
          height: ["ios", "android"].includes(Platform.OS) ? 420 : "50%",
          justifyContent: "space-evenly",
        }}
      >
        <Card mode="contained" style={{ padding: 15 }}>
          <Card.Content
            style={{
              height: ["ios", "android"].includes(Platform.OS) ? 150 : "20%",
              flexDirection: "row",
            }}
          >
            {/* it was vh */}
            <Avatar.Text label="XD" />
            <View
              style={{
                flexDirection: "column",
                marginLeft: ["ios", "android"].includes(Platform.OS)
                  ? 20
                  : "30px" /*was px = 30*/,
                justifyContent: "space-evenly",
              }}
            >
              <Text>Name: {userData.name}</Text>
              <Text>Email: {userData.email}</Text>
              <Text>Telephone: {userData.tel}</Text>
              <Text>City: {userData.favLocation}</Text>
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
