import React from "react";

const CSButton = ({
  icon = "",
  text,
  type = "button",
  handleClick = undefined,
  variant = "primary",
  bradius = "",
  size = "md",
  block = false,
  isLoading = false,
  ...attributes
}) => {
  return (
    <div className="cs__form__group">
      <button
        className={`cs__bttn ${
          block ? "cs__bttn__block" : ""
        } ${variant} ${bradius} ${size === "lg" ? "cs__bttn__lg" : ""}`}
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
            <p>{text}</p>
          </>
        )}
      </button>
    </div>
  );
};

export default CSButton;
