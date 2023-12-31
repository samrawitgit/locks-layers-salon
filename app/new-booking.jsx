import React, { useEffect, useState, useContext } from "react";
import { KeyboardAvoidingView, View, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton, Text, useTheme } from "react-native-paper";
import { ModalContext, useHttpClient, AuthContext } from "../utils";
import { TimeModal } from "../components/TimeModal";
import { BookingCalendar } from "../components/BookingCalendar";
import { useRouter } from "expo-router";

const NewBookingRoute = () => {
  const theme = useTheme();
  const router = useRouter();
  const { showModal } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [date, setDate] = useState(null);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState(null);

  const [allLocations, setAllLocations] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const loadSalonsData = async (token) => {
    return sendRequest("/admin/locations", "GET", null, {
      Authorization: `Bearer ${token}`,
    })
      .then(({ data }) => {
        console.log("locData loc", { data });
        if (data.error) {
          alert("Loading locations error");
          return { error: true };
        }
        setAllLocations(data.locations);
        const locationData = data.locations;
        sendRequest("/admin/services", "GET", null, {
          Authorization: `Bearer ${token}`,
        })
          .then(({ data }) => {
            console.log("salData service", { data });
            if (data.error) {
              alert("Loading services error");
              return { error: true };
            }
            setAllServices(data.services);
            const serviceData = data.service;
            return {
              error: locationData.error && serviceData.error,
              locationData,
              serviceData,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (["ios", "android"].includes(Platform.OS)) {
      SecureStore.getItemAsync("my_jwt")
        .then((res) => {
          console.log("gettoken", { res });
          if (!res) {
            router.push("/login");
          }
          loadSalonsData(res)
            .then((res) => {
              console.log("newBook jwt", { res });
              if (res.error) {
                return alert(res.message);
              }
              // setAllLocations(res.locationData);
              // setAllServices(res.serviceData);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log("no jwt in scurestore", err));
    } else {
      const token = localStorage.getItem("my_jwt");
      if (token) {
        loadSalonsData(token)
          .then((res) => {
            console.log("ueff res", { res });
          })
          .catch((err) => console.log(err));
      }
    }
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
        flex: 1,
        // flexGrow: 1,
        padding: 20,
        color: theme.colors.text,
        width: "100%", // it was vw //"100%",
        overflow: "scroll",
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
          justifyContent: "space-around",
          overflow: "scroll",
          minHeight: 765,
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
