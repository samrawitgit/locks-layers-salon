import { useState } from "react";
import {
  BottomNavigation,
  Button,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Pressable } from "react-native";

const NewBookingRoute = () => {
  const theme = useTheme();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const makeBooking = () => {
    // send API
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        color: theme.colors.text,
        width: "100vw",
      }}
    >
      <Text
        style={{
          fontSize: "40px",
          marginTop: 20,
          textAlign: "center",
          color: theme.colors.text,
        }}
      >
        New Booking
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 32,
          justifyContent: "space-evenly",
        }}
      >
        {/* <Pressable> */}
        <TextInput
          label="Date"
          value={date}
          onChangeText={(txt) => setDate(txt)}
          style={{
            // backgroundColor: "#e0e0e0",
            // marginBottom: 50,
            borderRadius: 4,
          }}
          // theme={{ roundness: 3 }}
        />
        <TextInput
          label="Time"
          value={time}
          onChangeText={(txt) => setTime(txt)}
          style={{
            // backgroundColor: "#e0e0e0",
            // marginBottom: 50,
            borderRadius: 4,
          }}
        />
        <TextInput
          label="Location"
          value={location}
          onChangeText={(txt) => setLocation(txt)}
          style={{
            // backgroundColor: "#e0e0e0",
            // marginBottom: 50,
            borderRadius: 4,
          }}
        />
        <Button
          mode="contained"
          uppercase
          // dark
          style={{
            // marginTop: 50,
            width: 200,
            height: 45,
            justifyContent: "center",
            alignSelf: "center",
          }}
          buttonColor={theme.colors.secondary}
          labelStyle={{ fontSize: 20, fontWeight: "bold" }}
        >
          Book
        </Button>
        {/* </Pressable> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewBookingRoute;
