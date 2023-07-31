import React from "react";

const CSTextarea = ({
  id = "",
  placeholder = "",
  label = "",
  size = "md",
  value,
  onChange = undefined,
  rows = 0,
  ...attributes
}) => {
  return (
    <div className="form-group cs__form__group">
      <label htmlFor={id} className="cs__form-label">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`${size === "lg" ? "cs__input__lg" : "cs__input"}`}
        rows={rows}
        placeholder={placeholder}
        {...attributes}
      />
    </div>
  );
};

export default CSTextarea;
