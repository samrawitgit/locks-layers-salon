import React, { useContext, useMemo, useEffect, useState } from "react";
import { ModalContext, range } from "../utils";
import { View } from "react-native";
import { Text, TextInput, TouchableRipple, useTheme } from "react-native-paper";

export const TimeModal = (props) => {
  const { date, setDate, location, service, selectedLoc, selectedSer } = props;
  const theme = useTheme();
  const { showModal } = useContext(ModalContext);
  const [timeTouched, setTimeTouched] = useState({ h: false, m: false });
  const [lastTime, setLastTime] = useState();

  const availableTime = useMemo(() => {
    if (selectedLoc && selectedSer && date) {
      const selectedDay = selectedLoc.business_hours.find(
        (day) => day.week_day_id === date.weekday()
      );
      if (selectedDay && service) {
        const open = parseInt(selectedDay.opening_time?.slice(0, 2));
        const close = parseInt(selectedDay.closing_time?.slice(0, 2));

        let hours_ = Array.from(range(open, close, 1));
        let min_ = Array.from(range(0, 50, 10));
        return { open, close, hours: hours_, min: min_, selectedSer };
      }
    }
  }, [date, location, service]);

  useEffect(() => {
    if (location && service && date) {
      const { selectedSer, close } = availableTime;
      const duration = selectedSer.duration.slice(0, 5);

      console.log({ dur: selectedSer.duration });
      switch (selectedSer.duration) {
        case "00:30:00":
          setLastTime({
            h: `${close - 1}`,
            m: "30",
            duration,
          });
          break;
        case "01:00:00":
          setLastTime({
            h: `${close - 1}`,
            m: "00",
            duration,
          });
          break;
        case "01:30:00":
          setLastTime({
            h: `${close - 2}`,
            m: "30",
            duration,
          });
          break;
        default:
          break;
      }
      if (timeTouched.h && timeTouched.m) {
        if (
          date.hour() > lastTime.h ||
          (date.hour() >= lastTime.h && date.minute() > lastTime.m)
        ) {
          console.log("final", { date });
          showModal({
            title: "Alert!",
            content: (
              <Text>
                Your selected time slot is too late to complete your service,
                the last available time you can book it is
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  {lastTime.h}:{lastTime.m}
                </Text>
              </Text>
            ),
            onDismissModal: () => setTimeTouched({ h: false, m: false }),
            dismissable: false,
            style: { height: "26%" }, //was vh
          });
        }
      }
    }
  }, [date, location, service, availableTime, timeTouched]);

  return (
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
        value={date && timeTouched.h ? date.format("HH:mm") : ""}
        onFocus={() => {
          if (!location || !service || !date) {
            showModal({
              title: "Alert",
              content: <Text>Select valid location, service & date first</Text>,
              style: { height: "20%" }, //was vh
            });
            return;
          }
          showModal({
            title: "Select time",
            content: {
              title: "Hour",
              content: (
                <>
                  {availableTime &&
                    availableTime.hours &&
                    availableTime.hours.length > 0 &&
                    availableTime.hours.map((hour, i) => (
                      <TouchableRipple
                        onPress={() => {
                          setDate((date) =>
                            date.set("hour", hour).set("second", 0)
                          );
                          setTimeTouched((prev) => ({ ...prev, h: true }));
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
                  {availableTime &&
                    availableTime.min.length > 0 &&
                    availableTime.min.map((min, i) => (
                      <TouchableRipple
                        onPress={() => {
                          setDate((date) => date.set("minute", min));
                          setTimeTouched((prev) => ({ ...prev, m: true }));
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
          });
        }}
        style={{
          // backgroundColor: "#e0e0e0",
          // marginBottom: 50,
          borderRadius: 4,
        }}
      />
    </View>
  );
};
