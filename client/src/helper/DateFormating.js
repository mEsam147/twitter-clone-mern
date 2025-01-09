import moment from "moment";

function formatDuration(date) {
  const duration = moment.duration(moment().diff(date));
  const seconds = duration.seconds();
  const minutes = duration.minutes();
  const hours = duration.hours();
  const days = duration.days();

  let formattedDate;
  if (days > 0) {
    formattedDate = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    formattedDate = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    formattedDate = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    formattedDate = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  return formattedDate;
}
export default formatDuration;

export const getDate = (date) => {
  return moment(date).format("DD MMMM YYYY");
};
