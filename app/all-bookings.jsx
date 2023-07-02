import { useEffect, useState } from "react";
import { Divider, List, Text, useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

  const [list, setList] = useState([
    { date: "03/07/2023", time: "11.30", location: "Rome", staff: "Mario" },
    { date: "03/07/2023", time: "11.30", location: "Rome", staff: "Mario" },
    { date: "03/07/2023", time: "11.30", location: "Rome", staff: "Mario" },
  ]);

  useEffect(() => {
    //fetch booking list
  }, []);

  if (list.length <= 0) {
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
        {list.map((b, i) => (
          <List.Accordion
            key={`booking-${i}`}
            title={`Booking ${i + 1}`}
            titleStyle={{
              fontSize: "30px",
              color: theme.colors.text,
            }}
            right={(props) => (
              <List.Icon
                {...props}
                icon="chevron-down"
                color={theme.colors.text}
                borderRadius="10px"
              />
            )}
          >
            <Item title={`${b.date} ${b.time}`} />
            <Item title={b.location} />
            <Item title={b.staff} />
          </List.Accordion>
        ))}
      </List.Section>
    </SafeAreaView>
  );
};

export default AllBookings;
