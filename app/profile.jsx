import { useContext, useEffect, useMemo, useState } from "react";
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
import { View } from "react-native-web";
import { useHttpClient } from "../utils";

const Profile = () => {
  const theme = useTheme();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    setIsLoading(true);
    const userId = localStorage.getItem("userId");

    sendRequest(`/auth/user/${userId}`)
      .then(({ data }) => {
        if (data.error) {
          console.log(data.message);
          return alert(data.message);
        }
        // console.log({ uD: data.userData });
        setUserData(data.userData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
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
