import React, { useContext, useEffect, useState } from "react";
import { List, Text, useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHttpClient } from "../utils/hooks/httpClient";
import { AuthContext } from "../utils";
import { useRouter } from "expo-router";

const Item = ({ title }) => {
  const theme = useTheme();
  return (
    <List.Item
      title={title}
      titleStyle={{ fontSize: 25 /*was px*/, color: theme.colors.text }}
      style={{ alignSelf: "center" }}
    />
  );
};

const AllBookings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { sendRequest, setIsLoading } = useHttpClient();
  const { user } = useContext(AuthContext);

  const [bookingList, setBookingList] = useState([]);

  const [expanded, setExpanded] = useState(bookingList.map((el) => false));

  const loadUserBookings = async (userId) => {
    console.log({ user, id: user ? user._id : "idk", userId });
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
    // router.push("/login");
    //fetch booking list
    setIsLoading(true);
    if (["ios", "android"].includes(Platform.OS)) {
      SecureStore.getItemAsync("userId")
        .then((userRes) => {
          console.log({ userRes });
          if (!userRes) {
            router.push("/login");
          } //TODO: check it works
          if (userRes) {
            loadUserBookings(userRes)
              .then((res) => {
                console.log("ueff res", { res });
                if (res.error) {
                  return alert(res.message);
                }
                setBookingList(res.bookings);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log("no userId in scurestore", err)); // TODO: redirect
    } else {
      const userId = localStorage.getItem("userId");
      if (userId) {
        loadUserBookings(userId)
          .then((res) => console.log("ueff res", { res }))
          .catch((err) => console.log(err));
      }
    }
    // console.log({ user, id: user ? user._id : "idk", userId });
    // console.log({ userId });
    // sendRequest(`/user-bookings/${userId}`)
    //   .then(({ data, error }) => {
    //     if (data.error) {
    //       console.log(data.message);
    //       return alert(data.message);
    //     }
    //     setBookingList(data.bookings);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert(err);
    //   })
    //   .finally(() => setIsLoading(false));
  }, []);

  const handlePress = (id) => {
    const newExpanded = [...expanded];
    newExpanded[id] = !newExpanded[id];
    setExpanded(newExpanded);
  };

  if (bookingList.length < 1) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30, color: theme.colors.text }}>
          No bookings available
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        // backgroundColor: theme.colors.background,
        color: theme.colors.text,
        width: "100%",
        overflow: "scroll",
      }}
    >
      <List.Section
        title="My Bookings"
        variant="displayMedium"
        titleStyle={{
          fontSize: 45 /*was px*/,
          marginVertical: 20,
          textAlign: "center",
          color: theme.colors.title,
        }}
      >
        {bookingList.map((b, i) => (
          <List.Accordion
            key={`booking-${i}`}
            title={`Booking ${i + 1}`}
            expanded={expanded[i]}
            onPress={() => handlePress(i)}
            titleStyle={{
              fontSize: 30 /*was px*/,
              color: theme.colors.text,
            }}
            // sx={{ width: "80%" }}
            right={(props) => (
              <List.Icon
                {...props}
                icon={expanded[i] ? "chevron-up" : "chevron-down"}
                color={theme.colors.text}
                borderRadius={10} /*was px*/
              />
            )}
          >
            <Item
              title={`
              ${b.booking_date.slice(0, 10)} 
              ${b.booking_date.slice(11, 16)}`}
            />
            <Item title={b.city} />
            <Item title={b.staff_name} />
          </List.Accordion>
        ))}
        {/* OLD
        {LIST.map((b, i) => (
          <List.Accordion
            key={`booking-${i}`}
            title={`Booking ${i + 1}`}
            expanded={expandedOld[i]}
            onPress={() => handlePressOld(i)}
            titleStyle={{
              fontSize: "30px",
              color: theme.colors.text,
            }}
            right={(props) => (
              <List.Icon
                {...props}
                icon={expandedOld[i] ? "chevron-up" : "chevron-down"}
                color={theme.colors.text}
                borderRadius="10px"
              />
            )}
          >
            <Item title={`${b.date} ${b.time}`} />
            <Item title={b.location} />
            <Item title={b.staff} />
          </List.Accordion>
        ))} */}
      </List.Section>
    </SafeAreaView>
  );
};

export default AllBookings;
