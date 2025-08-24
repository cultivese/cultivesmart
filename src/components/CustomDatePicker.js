import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Permite apenas segunda (1) e sexta (5)
function isAllowedDay(date) {
  const day = date.getDay();
  return day === 1 || day === 5;
}

const CustomDatePicker = ({ value, onChange, ...props }) => {
  return (
    <DatePicker
      selected={value ? new Date(value) : null}
      onChange={date => onChange(date ? date.toISOString().slice(0, 10) : null)}
      filterDate={isAllowedDay}
      dateFormat="yyyy-MM-dd"
      placeholderText="Selecione uma data (segunda ou sexta)"
      {...props}
    />
  );
};

export default CustomDatePicker;
