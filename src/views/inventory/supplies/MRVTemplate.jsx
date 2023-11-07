import moment from "moment";
import { formatCurrency } from "../../../services/helpers";
import logo from "../../../assets/images/logo.png";

const MRVTemplate = ({
  supply = undefined,
  vendor = undefined,
  items = [],
  getTotal = undefined,
}) => {
  const styles = {
    page: {
      backgroundColor: "#fff",
      border: "1px solid #cdcdcd",
      textTransform: "uppercase",
      width: 1280,
      height: 720,
      pageBreakAfter: "always",
    },
    columnLayout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.28rem",
    },
    columnLayoutNormal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    borderLine: {
      border: "1px solid #1d1d1d",
    },
    headerText: {
      color: "#028911",
      textTransform: "uppercase",
    },
    headerText2: {
      textTransform: "uppercase",
      letterSpacing: "2px",
    },
    h3Style: {
      color: "#1d1d1d",
      letterSpacing: "2px",
    },
    logoWidth: {
      width: "100px",
    },
    vendorSection: {
      padding: "0 1.28rem",
    },
    alignCenter: {
      textAlign: "center",
    },
  };

  return (
    <>
      <div style={styles.page} className="print__view">
        <div style={styles.borderLine} className="line__border">
          <div style={styles.columnLayout} className="print__page__header">
            <div className="company__head__titlle">
              <h1 style={styles.headerText}>
                Nigerian Content Development and Monitoring Board
              </h1>
              <h3 style={styles.headerText2}>National Management Sector</h3>
            </div>
            <div className="logo__section">
              <img style={styles.logoWidth} src={logo} alt="page logo" />
            </div>
          </div>
          <div style={styles.columnLayout} className="sub__section">
            <div className="sub__title">
              <h2>Material Received Voucher</h2>
            </div>
            <div className="serial__no">
              <h3>Serial No: {supply?.code}</h3>
            </div>
          </div>
        </div>
        <div style={styles.columnLayout} className="details__mrv__section">
          <div className="order__no">
            <h3>Purchase Order Number: {supply?.code} </h3>
          </div>
          <div className="off_no">
            <h3>Of:</h3>
          </div>
        </div>
        <div style={styles.vendorSection} className="vendor__section mb-4">
          <h3 className="mb-3">Supplier: {vendor?.name}</h3>
          <div className="displace">
            <h3>Waybill No:</h3>
            <h3>Of:</h3>
          </div>
        </div>

        <div className="items__section mb-5">
          <table className="table table-bordered cs__table__content">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Material Description</th>
                <th>Location</th>
                <th>LAS</th>
                <th>Qty Accpt</th>
                <th>Stock Bal</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={i}>
                  <td>{item?.item?.name}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.item?.description}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{formatCurrency(parseFloat(item?.amount), true)}</td>
                  <td>
                    {formatCurrency(
                      getTotal(item?.amount, item?.quantity),
                      true
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="authorization mb-5">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Authorization</th>
                <th>Received By</th>
                <th>Inspected By</th>
                <th>Checked By (Audit)</th>
                <th>Collected By</th>
                <th>Posted By</th>
                <th>Costed By (Finance)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Signature:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Designation:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Date:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={styles.columnLayoutNormal} className="approved_by">
          <div className="signature">
            <h3>Approved By:</h3>
            <small>Head Material Management Section</small>
          </div>
          <div className="sig__date">
            <h3>Date: {moment().format("LL")}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default MRVTemplate;
