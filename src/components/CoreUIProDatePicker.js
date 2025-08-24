import React, { useEffect, useRef } from 'react';

const CoreUIProDatePicker = ({ value, onChange, id = 'coreuipro-datepicker', ...props }) => {
  const pickerRef = useRef();

  useEffect(() => {
    // Aguarda o carregamento do JS do CoreUI Pro
    const interval = setInterval(() => {
      if (window.coreui && window.coreui.DatePicker && pickerRef.current) {
        // Remove instância anterior se existir
        if (pickerRef.current._coreuiDatePicker) {
          pickerRef.current._coreuiDatePicker.dispose();
        }
        // Cria nova instância
        const dp = new window.coreui.DatePicker(pickerRef.current, {
          date: value ? new Date(value) : null,
          locale: 'pt-BR',
          disabledDates: date => {
            const day = date.getDay();
            return !(day === 1 || day === 5); // Só segunda e sexta
          },
          ...props,
        });
        pickerRef.current._coreuiDatePicker = dp;
        dp._element.addEventListener('dateChange.coreui.date-picker', (e) => {
          if (e.detail && e.detail.date) {
            onChange(e.detail.date.toISOString().slice(0, 10));
          }
        });
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [value, onChange, props]);

  return <div ref={pickerRef} id={id} />;
};

export default CoreUIProDatePicker;
