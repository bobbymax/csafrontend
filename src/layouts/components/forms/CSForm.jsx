import React from "react";

const CSForm = ({
  txtHeader = "",
  lg = 4,
  md = 6,
  sm = 12,
  formSubmit = undefined,
  noBorder = false,
  noHeader = false,
  children,
}) => {
  return (
    <div className={`col-md-${md} col-sm-${sm} col-lg-${lg}`}>
      <div className={`form__card ${!noBorder ? "form__border" : ""}`}>
        {!noHeader && (
          <div className="form__card__header">
            <h3>{txtHeader}</h3>
          </div>
        )}
        <div className="form__card__body">
          <form onSubmit={formSubmit} encType="multipart/form-data">
            <div className="row">{children}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSForm;
