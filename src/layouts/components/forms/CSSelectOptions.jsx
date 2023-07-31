import React from "react";

const CSSelectOptions = ({ value, label, disabled = false }) => {
  return (
    <option value={value} disabled={disabled}>
      {label}
    </option>
  );
};

export default CSSelectOptions;
