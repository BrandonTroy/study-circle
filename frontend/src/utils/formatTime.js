function formatDate(date) {
  const now = new Date();
  const inputDate = new Date(date);
  const diffInDays = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (diffInDays === 0) {
    // Same day
    return formatTime(date);
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Less than a week ago
    return daysOfWeek[inputDate.getDay()];
  } else if (diffInDays < 365) {
    // Less than a year ago
    return `${monthsOfYear[inputDate.getMonth()]} ${inputDate.getDate()}`;
  } else {
    // More than a year ago
    return `${inputDate.getMonth() + 1}/${inputDate.getDate()}/${inputDate.getFullYear().toString().substr(-2)}`;
  }
}

function formatTime(date) {
  const inputDate = new Date(date);
  return inputDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function formatDuration(date, long=false) {
  const duration = Math.floor((new Date() - new Date(date)) / (1000 * 60));
  if (duration < 60) {
    // Less than 60 minutes, return in minutes
    return long ? `${duration} min${duration === 1 ? '' : 's'}` : `${duration}m`;
  } else if (duration < 60 * 24) {
    // Less than 24 hours, return in hours
    const hours = Math.floor(duration / 60);
    return long ? `${hours} hour${hours === 1 ? '' : 's'}` : `${hours}h`;
  } else if (duration < 60 * 24 * 7) {
    // Less than 7 days, return in days
    const days = Math.floor(duration / (60 * 24));
    return long ? `${days} day${days === 1 ? '' : 's'}` : `${days}d`;
  } else {
    // More than 7 days, return in weeks
    const weeks = Math.floor(duration / (60 * 24 * 7));
    return long ? `${weeks} week${weeks === 1 ? '' : 's'}` : `${weeks}w`;
  }
}

export { formatDate, formatTime, formatDuration };