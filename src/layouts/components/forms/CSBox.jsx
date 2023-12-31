const CSBox = ({
  type = "checkbox",
  id = "",
  label = "",
  value,
  onChange = undefined,
  noMargin = false,
  ...attributes
}) => {
  return (
    <div
      className={`form-check form-switch cs__form__group ${
        noMargin && "remove-mg"
      }`}
    >
      <input
        className="form-check-input"
        type={type}
        role="switch"
        id={id}
        value={value}
        onChange={onChange}
        {...attributes}
      />
      <label className="form-check-label cs__checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default CSBox;
