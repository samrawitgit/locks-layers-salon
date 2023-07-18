import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  RadioButton,
  Text,
  TextInput,
  TouchableRipple,
  Surface,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View, Pressable } from "react-native";
import {
  DatePickerInput,
  it,
  en,
  registerTranslation,
} from "react-native-paper-dates";
import { ModalContext } from "../utils/containers/modal.container";
import { DatePickerModal } from "react-native-paper-dates/src/Date/DatePickerModal";
import dayjs, { isDayjs } from "dayjs";
import { useHttpClient } from "../utils/hooks/httpClient";
import { AuthContext } from "../utils/containers/auth.container";

registerTranslation("en", en);

const AVAILABLE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const MINUTES = [0, 10, 20, 30, 40, 50];

const NewBookingRoute = () => {
  const theme = useTheme();
  const { showModal } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [date, setDate] = useState(null);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState("");

  const [timeTouched, setTimeTouched] = useState(false);
  const [openDateModal, setOpenDateModal] = React.useState(false);

  useEffect(() => {
    //fetch locations services, time availability
  }, []);

  const onDismissSingle = React.useCallback(() => {
    setOpenDateModal(false);
  }, [setOpenDateModal]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpenDateModal(false);
      setDate(dayjs(params.date));
    },
    [setOpenDateModal, setDate]
  );

  const makeBooking = async () => {
    // send API to /new-booking
    console.log({ date });
    const newBookingRes = await sendRequest(
      "/new-booking",
      "POST",
      { userId: user.id, service: service, location: location, date: date },
      { "Content-Type": "application/json" }
    );
    if (!newBookingRes.error) {
      console.log({ newBookingRes });
    } else {
      console.log({ err: newBookingRes.error });
    }
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
        variant="displayMedium"
        style={{
          marginTop: 20,
          textAlign: "center",
          color: theme.colors.title,
        }}
      >
        New Booking
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          height: "80vh",
          justifyContent: "space-around",
          overflow: "scroll",
        }}
      >
        <View>
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              marginLeft: 5,
              color: theme.colors.text,
            }}
          >
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

        <View>
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              marginLeft: 5,
              color: theme.colors.text,
            }}
          >
            Select a Service
          </Text>
          <RadioButton.Group
            onValueChange={(newValue) => setService(newValue)}
            value={service}
          >
            <RadioButton.Item
              label="Trim"
              value="trim" // maybe id_service is best
              style={{ backgroundColor: "#e7e0ec" }}
            />
            <RadioButton.Item
              label="Perm"
              value="perm"
              style={{ backgroundColor: "#e7e0ec" }}
            />
            <RadioButton.Item
              label="Color"
              value="color"
              style={{ backgroundColor: "#e7e0ec" }}
            />
          </RadioButton.Group>
        </View>

        {/* <Pressable> */}
        <View>
          <Text
            variant="titleLarge"
            style={{
              // fontSize: 24,
              // marginBottom: 10,
              marginLeft: 5,
              color: theme.colors.text,
            }}
          >
            Select a Date
          </Text>
          <Surface
            mode="flat"
            elevation={0}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              padding: 5,
            }}
          >
            <Text variant="titleMedium" style={{ color: theme.colors.text }}>
              {isDayjs(date) ? date.format("DD/MM/YYYY") : "No date selected."}
            </Text>
            {/* ` ${date.toJSON().slice(0, 10)}` */}

            <Button
              mode="contained"
              onPress={() => setOpenDateModal(true)}
              uppercase={false}
              buttonColor="#331e6d70"
              textColor={theme.colors.text}
            >
              Pick single date
            </Button>
          </Surface>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={openDateModal}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={onConfirmSingle}
          />
        </View>

        <View>
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              marginLeft: 5,
              color: theme.colors.text,
            }}
          >
            Select a Time
          </Text>
          <TextInput
            label="Time"
            // value={time.hour ? time.hour + ":" + time.min : ""}
            // onChangeText={(txt) => setTime(txt)}
            value={date && timeTouched ? date.format("HH:mm") : ""}
            onFocus={() => {
              if (!date) {
                showModal({
                  title: "Alert",
                  content: <Text>Select valid date first</Text>,
                });
                return;
              }
              return showModal({
                title: "Select time",
                content: {
                  title: "Hour",
                  content: (
                    <>
                      {AVAILABLE_HOURS.map((hour, i) => (
                        <TouchableRipple
                          onPress={() => {
                            setDate((date) =>
                              date.set("hour", hour).set("second", 0)
                            );
                            setTimeTouched(true);
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
                            setDate((date) => date.set("minute", min));
                            setTimeTouched(true);
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
              });
            }}
            style={{
              // backgroundColor: "#e0e0e0",
              // marginBottom: 50,
              borderRadius: 4,
            }}
          />
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
