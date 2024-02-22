

const CSSelect = ({
  label = "",
  name = "",
  value,
  onChange,
  children,
  size = "md",
  ...attributes
}) => {
  return (
    <div className="cs__form__group">
      <label htmlFor={name} className="cs__form-label">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`${size === "lg" ? "cs__select__lg" : "cs__select"}`}
        {...attributes}
      >
        {children}
      </select>
    </div>
  );
};

export default CSSelect;
