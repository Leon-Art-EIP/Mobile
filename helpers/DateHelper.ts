const dateToHour = (date: Date | number) => {
  return (new Date(date)).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export {
  dateToHour
};
