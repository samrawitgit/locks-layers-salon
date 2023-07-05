import React, { useCallback, useState, useContext } from "react";
import {
  Button,
  RadioButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Pressable } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { View } from "react-native-web";
import { ModalContext } from "../utils/containers/modal.container";

const AVAILABLE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const MINUTES = [0, 10, 20, 30, 40, 50];

const NewBookingRoute = () => {
  const theme = useTheme();
  const { showModal } = useContext(ModalContext);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState({ hour: null, min: null });
  const [expanded, setExpanded] = useState(false);
  const [location, setLocation] = useState("");

  const onDismiss = useCallback(() => {
    setExpanded(false);
  }, []);

  const onConfirm = useCallback(({ hours, minutes }) => {
    setExpanded(false);
    console.log({ hours, minutes });
    setTime(`${hours}:${minutes}`);
  }, []);

  const SelectTime = (isHour) => {
    if (isHour) {
      return AVAILABLE_HOURS.map((hour, i) => (
        <TouchableRipple
          onPress={() => {
            // date.set("hour", hour);
            date.setHours(hour);
            setTime((prev) => ({ ...prev, hour: hour }));
          }}
          rippleColor="rgba(0, 0, 0, .32)"
          key={i}
          style={{
            height: 70,
            width: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 32 }}>{hour}</Text>
        </TouchableRipple>
      ));
    }
    return MINUTES.map((min, i) => (
      <TouchableRipple
        onPress={() => {
          // date.set("minute", min);
          date.setMinutes(min);
          setTime((prev) => ({ ...prev, min: min }));
        }}
        rippleColor="rgba(0, 0, 0, .32)"
        key={i}
        style={{
          height: 70,
          width: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 32 }}>{min}</Text>
      </TouchableRipple>
    ));
  };

  const makeBooking = () => {
    // send API
    const date1 = new Date(date);
    console.log({ time, date });
  };

  return (
    <SafeAreaView
      style={{
        // flexGrow: 1,
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
          // flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 32,
          height: "80vh",
          justifyContent: "space-around",
          // justifyContent: "space-evenly",
          // alignContent: "space-between",
        }}
      >
        {/* <Pressable> */}
        <View>
          <Text style={{ fontSize: 24, marginBottom: 10, marginLeft: 5 }}>
            Select a Date
          </Text>
          <DatePickerInput
            locale={"it"}
            saveLabel="Salva"
            label="Date"
            value={date}
            onChange={(txt) => {
              setDate(new Date(txt));
              console.log({ txt });
            }}
            inputMode="start"
            style={{}}
          />
        </View>

        <View>
          <Text style={{ fontSize: 24, marginBottom: 10, marginLeft: 5 }}>
            Select a Time
          </Text>
          <TextInput
            label="Time"
            value={time.hour ? time.hour + ":" + time.min : ""}
            onChangeText={(txt) => setTime(txt)}
            onFocus={() =>
              showModal({
                title: "Select time",
                content: {
                  title: "Hour",
                  content: (
                    <>
                      {AVAILABLE_HOURS.map((hour, i) => (
                        <TouchableRipple
                          onPress={() => {
                            // date.set("hour", hour);
                            date.setHours(hour);
                            setTime((prev) => ({ ...prev, hour: hour }));
                          }}
                          rippleColor="rgba(0, 0, 0, .32)"
                          key={i}
                          style={{
                            height: 70,
                            width: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 32 }}>{hour}</Text>
                        </TouchableRipple>
                      ))}
                    </>
                  ),
                },
                secondScrollView: {
                  title: "Min.",
                  content: (
                    <>
                      {MINUTES.map((min, i) => (
                        <TouchableRipple
                          onPress={() => {
                            // date.set("minute", min);
                            date.setMinutes(min);
                            setTime((prev) => ({ ...prev, min: min }));
                          }}
                          rippleColor="rgba(0, 0, 0, .32)"
                          key={i}
                          style={{
                            height: 70,
                            width: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 32 }}>{min}</Text>
                        </TouchableRipple>
                      ))}
                    </>
                  ),
                },
                onDismissModal: () => {
                  // setDate(date.hour(time.hour).minute(time.min));
                },
              })
            }
            style={{
              // backgroundColor: "#e0e0e0",
              // marginBottom: 50,
              borderRadius: 4,
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 24, marginBottom: 10, marginLeft: 5 }}>
            Select a Location
          </Text>
          <RadioButton.Group
            onValueChange={(newValue) => setLocation(newValue)}
            value={location}
          >
            <RadioButton.Item
              label="Torino"
              value="torino"
              style={{ backgroundColor: "#e7e0ec" }}
            />
            <RadioButton.Item
              label="Milano"
              value="milano"
              style={{ backgroundColor: "#e7e0ec" }}
            />
            <RadioButton.Item
              label="Roma"
              value="roma"
              style={{ backgroundColor: "#e7e0ec" }}
            />
          </RadioButton.Group>
        </View>
        <Button
          mode="contained"
          uppercase
          // dark
          style={{
            width: 200,
            height: 45,
            justifyContent: "center",
            alignSelf: "center",
          }}
          buttonColor={theme.colors.secondary}
          labelStyle={{ fontSize: 20, fontWeight: "bold" }}
          onPress={makeBooking}
        >
          Book
        </Button>
        {/* </Pressable> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewBookingRoute;
