import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Slider, IconButton, CssBaseline, createTheme, ThemeProvider, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { format, setHours, setMinutes, addMinutes, getHours } from 'date-fns';

const timezones = [
  { name: 'UTC', offset: 0 },
  { name: 'IST', offset: 5.5 },
  { name: 'EST', offset: -5 },
  { name: 'PST', offset: -8 }
];

const gradients = [
  'linear-gradient(to right, #7fffd4, #faebd7)',
  'linear-gradient(to right, #6495ed, #f8f8ff)',
  'linear-gradient(to right, #ffb6c1, #90ee90)',
  'linear-gradient(to right, #ff6347, #ffe4e1)'
];

export const TimezoneChange = () => {
  const [time, setTime] = useState(new Date());
  const [zones, setZones] = useState(timezones);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  const handleSliderChange = (zoneOffset) => (event, newValue) => {
    const newTime = setHours(setMinutes(selectedDate, 0), newValue - zoneOffset);
    setTime(newTime);
  };

  const handleDateChange = (date) => {
    const newTime = setHours(setMinutes(date, 0), getHours(time));
    setSelectedDate(date);
    setTime(newTime);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(zones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setZones(items);
  };

  const removeTimezone = (index) => {
    const newZones = zones.filter((_, i) => i !== index);
    setZones(newZones);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const swapTimezones = () => {
    const swappedZones = [...zones].reverse();
    setZones(swappedZones);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const marks = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i}`
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="header">
          <h1>PLAY POWER TIMEZONE</h1>
          <div className="controls">
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <button className="swap-button" onClick={swapTimezones}>Swap Timezones</button>
            <a href="https://calendar.google.com/calendar/u/0/r/eventedit?" target='blank' className="add-event-button">Schedule Event</a>
          </div>
        </div>
        <div className="date-controls">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            showYearDropdown
            scrollableYearDropdown
          />
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="zones">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {zones.map((zone, index) => (
                  <Draggable key={zone.name} draggableId={zone.name} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="timezone-box"
                        sx={{
                          background: gradients[index % gradients.length], 
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div>
                          {zone.name} - {format(addMinutes(time, zone.offset * 60), 'hh:mm a')} on {format(selectedDate, 'MM/dd/yyyy')}
                        </div>
                        <Slider
                          className="slider"
                          value={getHours(addMinutes(time, zone.offset * 60))}
                          onChange={handleSliderChange(zone.offset)}
                          aria-labelledby="continuous-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          marks={marks}
                          min={0}
                          max={23}
                        />
                        <button className="remove-button" onClick={() => removeTimezone(index)}>X</button>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </ThemeProvider>
  );
};


