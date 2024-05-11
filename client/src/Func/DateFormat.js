 const formatDate = (date) => {
  const eventDate = new Date(date);
  const year = eventDate.getFullYear();
  const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
  const day = eventDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default formatDate;