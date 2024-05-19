 export const formatDate = (date) => {
  const eventDate = new Date(date);
  const year = eventDate.getFullYear();
  const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
  const day = eventDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleDateString('ru-RU', options);
}

export default formatDate;