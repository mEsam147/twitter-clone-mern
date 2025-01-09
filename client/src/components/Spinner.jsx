import React from "react";

const Spinner = ({ size = "lg" }) => {
  return <span className={`loading loading-spinner loading-${size}`}></span>;
};

export default Spinner;
