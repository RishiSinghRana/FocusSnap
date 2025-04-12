import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const Calendar = () => {
  const [selected, setSelected] = useState('');

  const markedDates = {
    [selected]: { selected: true, selectedColor: 'blue' },
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        style={styles.calendar}
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={markedDates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: 'lightblue',
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  currentDay: {
    backgroundColor: 'lightgreen',
  },
  currentDayText: {
    fontWeight: 'bold',
  },
});

export default Calendar;