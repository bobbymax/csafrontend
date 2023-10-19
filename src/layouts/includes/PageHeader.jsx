import CSButton from "../components/forms/CSButton";

const PageHeader = ({
  md = 12,
  icon = "widgets",
  text,
  btnText = "",
  variant = "dark",
  btnIcon = "add",
  handleClick = undefined,
  disabled = false,
}) => {
  return (
    <div className={`col-md-${md} mb-4`}>
      <div className="page__header">
        <div className="page__header__name">
          <span className="material-icons-sharp">{icon}</span>
          <h2>{text}</h2>
        </div>
        {btnText !== "" && (
          <div className="page__header__resource">
            <CSButton
              text={btnText}
              icon={btnIcon}
              variant={variant}
              disabled={disabled}
              onClick={() => handleClick()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
