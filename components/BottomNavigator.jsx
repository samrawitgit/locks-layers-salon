import * as React from "react";
import { BottomNavigation, Button, Text } from "react-native-paper";
import AllBookingsRoute from "../app/all-bookings";
import NewBookingRoute from "../app/new-booking";
import ProfileRoute from "../app/profile";
import LocationsRoute from "../app/locations";
import NotificationsRoute from "../app/notifications";

const BottomNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "bookings",
      title: "My Bookings",
      focusedIcon: "calendar",
      unfocusedIcon: "calendar-outline",
    },
    // {
    //   key: "locations",
    //   title: "Locations",
    //   focusedIcon: "pin",
    //   unfocusedIcon: "pin-outline",
    // },
    {
      key: "new-booking",
      title: "New Booking",
      focusedIcon: "plus-circle",
      unfocusedIcon: "plus-circle-outline",
    },
    // {
    //   key: "notifications",
    //   title: "Notifications",
    //   focusedIcon: "bell",
    //   unfocusedIcon: "bell-outline",
    // },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    bookings: AllBookingsRoute,
    // locations: LocationsRoute,
    "new-booking": NewBookingRoute,
    // notifications: NotificationsRoute,
    profile: ProfileRoute,
  });

  // const renderLabel = ({ route, title }) => {
  //   console.log({ title: route.title });
  //   return (
  //     <Text style={{ textAlign: "center", fontSize: "12px" }}>
  //       {route.title}
  //     </Text>
  //   );
  // };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ width: "100vw" }}
      // renderLabel={renderLabel}
    />
  );
};

export default BottomNavigator;
