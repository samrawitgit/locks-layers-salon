import React, { useCallback, useContext, useState, useMemo } from "react";
import dayjs, { isDayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import {
  DatePickerModal,
  en,
  registerTranslation,
} from "react-native-paper-dates";
import { ModalContext } from "../utils";

dayjs.extend(weekday);
registerTranslation("en", en);

const TODAY = dayjs();

export const BookingCalendar = (props) => {
  const theme = useTheme();
  const { date, setDate, selectedLoc } = props;
  const { showModal } = useContext(ModalContext);

  const [openDateModal, setOpenDateModal] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpenDateModal(false);
  }, [setOpenDateModal]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpenDateModal(false);
      const selectedDate = dayjs(params.date);
      console.log({
        weekday: selectedDate.day(),
        weedayP: selectedDate.weekday(),
      });
      setDate(dayjs(params.date));
    },
    [setOpenDateModal, setDate]
  );

  const disabledDates = useMemo(() => {
    if (selectedLoc) {
      console.log({ selectedLoc });
      const bh = selectedLoc.business_hours;
      return bh.filter((day) => day.closed).map((day) => day.week_day_id);
    }
  }, [location]);

  return (
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
          onPress={() =>
            selectedLoc
              ? setOpenDateModal(true)
              : showModal({ title: "Pick a salon first" })
          }
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
        date={date ? date.toDate() : new Date()}
        disableWeekDays={disabledDates}
        onConfirm={onConfirmSingle}
        validRange={{
          startDate: TODAY.toDate(),
        }}
      />
    </View>
  );
};
