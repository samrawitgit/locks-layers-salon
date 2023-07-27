import React, { useEffect, useState, useContext } from "react";
import { KeyboardAvoidingView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton, Text, useTheme } from "react-native-paper";
import { ModalContext, useHttpClient, AuthContext } from "../utils";
import { TimeModal } from "../components/TimeModal";
import { BookingCalendar } from "../components/BookingCalendar";

const NewBookingRoute = () => {
  const theme = useTheme();
  const { showModal } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [date, setDate] = useState(null);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState(null);

  const [allLocations, setAllLocations] = useState([]);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log({ token });
    sendRequest("/admin/locations", "GET", null, {
      Authorization: `Bearer ${token}`,
    })
      .then(({ data }) => {
        console.log({ data });
        if (!data.error) {
          setAllLocations(data.locations);
          sendRequest("/admin/services", "GET", null, {
            Authorization: `Bearer ${token}`,
          })
            .then(({ data }) => {
              if (!data.error) {
                setAllServices(data.services);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const makeBooking = async () => {
    console.log({ userId: user._id, service, location, date });
    const newBookingRes = await sendRequest(
      "/new-booking",
      "POST",
      { userId: user._id, serviceId: service, locationId: location, date },
      { "Content-Type": "application/json" }
    );
    showModal({
      title:
        newBookingRes.error || newBookingRes.data.error ? "Error" : "Success!",
      content: <Text>{newBookingRes.data.message}</Text>,
      onDismissModal: () => {
        setDate(null);
        setService(null);
        setLocation(null);
        setTimeTouched({ h: false, m: false });
      },
    });
    return;
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
            {allLocations.map((loc, i) => {
              return (
                <RadioButton.Item
                  key={`loc-radio-${i}`}
                  label={loc.city}
                  value={loc.id_location}
                  style={{ backgroundColor: "#e7e0ec" }}
                />
              );
            })}
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
            {allServices.map((ser, i) => (
              <RadioButton.Item
                key={`ser-radio-${i}`}
                label={ser.service_type}
                value={ser.id}
                style={{
                  backgroundColor: "#e7e0ec",
                  textTransform: "capitalize",
                }}
              />
            ))}
          </RadioButton.Group>
        </View>

        <BookingCalendar
          date={date}
          setDate={setDate}
          selectedLoc={allLocations.find((loc) => loc.id_location === location)}
        />

        {/* <Pressable> */}

        <TimeModal
          date={date}
          setDate={setDate}
          location={location}
          service={service}
          selectedLoc={allLocations.find((loc) => loc.id_location === location)}
          selectedSer={allServices.find((s) => s.id === service)}
        />

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
