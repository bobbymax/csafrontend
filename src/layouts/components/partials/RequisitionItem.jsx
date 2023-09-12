const RequisitionItem = ({
  item,
  title,
  quantity,
  description,
  manage = undefined,
  destroy = undefined,
  editable = false,
  showComments = false,
  view = false,
}) => {
  const getPriority = (priority) => {
    let color;

    switch (priority) {
      case "high":
        color = "danger";
        break;

      case "medium":
        color = "warning";
        break;

      default:
        color = "primary";
        break;
    }

    return color;
  };

  return (
    <div className="items">
      <div className="items__header">
        <p>{title}</p>
        <p>
          Quantity: <strong>{quantity}</strong>
        </p>
      </div>
      <div className="items__body">
        <p>{description}</p>
        <small style={{ letterSpacing: 1.5, display: "block", marginTop: 5 }}>
          Priority:{" "}
          <span className={`text-${getPriority(item?.priority)}`}>
            {item?.priority?.toUpperCase()}
          </span>
        </small>
      </div>
      {!view && (
        <div className="items__footer">
          <div className="cs__btn__group">
            <button
              className="items__btn dark"
              type="button"
              onClick={() => manage(item)}
              disabled={!editable}
            >
              <span className="material-icons-sharp">edit_note</span>
            </button>
            <button
              className="items__btn danger"
              type="button"
              onClick={() => destroy(item)}
              disabled={!editable}
            >
              <span className="material-icons-sharp">remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisitionItem;
