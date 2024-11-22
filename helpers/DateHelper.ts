const dateToHour = (date: Date | number | string) => {
  return (new Date(date)).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export {
  dateToHour
};
