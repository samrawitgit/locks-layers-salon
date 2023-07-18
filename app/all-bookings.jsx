import { useEffect, useState } from "react";
import { List, Text, useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHttpClient } from "../utils/hooks/httpClient";

const Item = ({ title }) => {
  const theme = useTheme();
  return (
    <List.Item
      title={title}
      titleStyle={{ fontSize: "25px", color: theme.colors.text }}
      style={{ alignSelf: "center" }}
    />
  );
};

const AllBookings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { sendRequest } = useHttpClient();

  const [bookingList, setBookingList] = useState([]);

  const [expanded, setExpanded] = useState(bookingList.map((el) => false));

  useEffect(() => {
    //fetch booking list
    const userId = localStorage.getItem("userId");
    console.log({ userId });
    sendRequest(`/user-bookings/${userId}`)
      .then(({ data, error }) => {
        if (data.error) {
          console.log(data.message);
          return alert(data.message);
        }
        setBookingList(data.bookings);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }, []);

  const handlePress = (id) => {
    const newExpanded = [...expanded];
    newExpanded[id] = !newExpanded[id];
    setExpanded(newExpanded);
  };

  if (bookingList.length <= 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: "30px" }}>No bookings available</Text>
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
        width: "100vw",
        overflow: "scroll",
      }}
    >
      <List.Section
        title="My Bookings"
        titleStyle={{
          fontSize: "40px",
          marginVertical: 20,
          textAlign: "center",
          color: theme.colors.text,
        }}
      >
        {bookingList.map((b, i) => (
          <List.Accordion
            key={`booking-${i}`}
            title={`Booking ${i + 1}`}
            expanded={expanded[i]}
            onPress={() => handlePress(i)}
            titleStyle={{
              fontSize: "30px",
              color: theme.colors.text,
            }}
            // sx={{ width: "80%" }}
            right={(props) => (
              <List.Icon
                {...props}
                icon={expanded[i] ? "chevron-up" : "chevron-down"}
                color={theme.colors.text}
                borderRadius="10px"
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
