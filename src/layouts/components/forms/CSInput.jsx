const CSInput = ({
  type = "text",
  id = "",
  size = "md",
  placeholder = "",
  label = "",
  value,
  onChange = undefined,
  bradius = false,
  ...attributes
}) => {
  return (
    <div className="cs__form__group">
      <label htmlFor={id} className="cs__form-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={`${size === "lg" ? "cs__input__lg" : "cs__input"} ${
          bradius ? "input__has__radius" : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...attributes}
      />
    </div>
  );
};

export default CSInput;
