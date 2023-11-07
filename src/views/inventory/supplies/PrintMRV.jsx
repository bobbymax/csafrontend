import PageHeader from "../../../layouts/includes/PageHeader";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import MRVTemplate from "./MRVTemplate";

const PrintMRV = () => {
  const location = useLocation();
  const templateRef = useRef(null);

  const [supply, setSupply] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [items, setItems] = useState([]);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1280, 720],
    });

    doc.html(templateRef.current, {
      async callback(doc) {
        doc.save("document");
      },
    });
  };

  const getTotal = (unit, quantity) => {
    return parseFloat(unit) * parseInt(quantity);
  };

  useEffect(() => {
    if (location && location.state !== null && location.state?.supply) {
      const { supply } = location.state;

      setSupply(supply);
      setVendor(supply?.attributes?.vendor);
      setItems(supply?.attributes?.items);
    }
  }, [location]);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Print Page"
          btnIcon="print"
          btnText="Print MRV"
          variant="primary"
          handleClick={generatePDF}
        />

        <div className="col-md-12">
          <div ref={templateRef}>
            <MRVTemplate
              supply={supply}
              vendor={vendor}
              items={items}
              getTotal={getTotal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintMRV;
