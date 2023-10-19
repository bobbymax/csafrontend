import React from "react";

const CSButton = ({
  icon = "",
  text = "",
  type = "button",
  handleClick = undefined,
  variant = "primary",
  bradius = "",
  size = "md",
  block = false,
  isLoading = false,
  small = false,
  borderRadius = false,
  ...attributes
}) => {
  return (
    <div className="cs__form__group">
      <button
        className={`cs__bttn ${
          block ? "cs__bttn__block" : ""
        } ${variant} ${bradius} ${size === "lg" ? "cs__bttn__lg" : ""} ${
          small ? "cs__bttn__sm" : ""
        } ${borderRadius ? "input__has__radius" : ""}`}
        type={type}
        onClick={handleClick}
        {...attributes}
      >
        {isLoading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only"></span>
          </div>
        ) : (
          <>
            <span className="material-icons-sharp">{icon}</span>
            {text !== "" && <p>{text}</p>}
          </>
        )}
      </button>
    </div>
  );
};

export default CSButton;
