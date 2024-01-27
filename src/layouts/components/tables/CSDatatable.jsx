import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

const CSDatatable = ({
  columns = [],
  cols = [],
  data = [],
  manage = undefined,
  print = undefined,
  isSearchable = false,
  destroy = undefined,
  assign = undefined,
  view = undefined,
  approve = undefined,
  exportable = false,
  task = undefined,
  confirmBooking = undefined,
  rowsPerPage = 10,
  close = undefined,
}) => {
  const [exports, setExports] = useState([]);
  const dt = useRef(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  useEffect(() => {
    if (columns.length > 0 && data.length > 0) {
      setExports(data);
    }
  }, [columns, data]);

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, exports);
        doc.save("exports.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(exports);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "exports");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const blob = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          blob,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const actionBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__info"
        onClick={() => manage(raw)}
      >
        <span className="material-icons-sharp">settings</span>
        <p>Manage</p>
      </button>
    );
  };

  const closeRequestTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__danger"
        onClick={() => close(raw)}
      >
        <span className="material-icons-sharp">close</span>
        <p>Close Request</p>
      </button>
    );
  };

  const isArrayTemplate = (raw) => {
    let display = "";

    for (let i = 0; i < raw?.staff?.length; i++) {
      const staffName = raw?.staff[i];
      display += `${staffName}${i < raw?.staff?.length - 1 ? ", " : ""}`;
    }

    return (
      <>
        <p>{display?.length < 1 ? "Not Assigned" : display}</p>
      </>
    );
  };

  const printBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__bttn bg__dark"
        onClick={() => print(raw)}
      >
        <span className="material-icons-sharp">print</span>
      </button>
    );
  };

  const assignTaskBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="assign__task__btn bg__dark"
        onClick={() => task(raw)}
        disabled={raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">person_add</span>
        Assign
      </button>
    );
  };

  const destroyBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__danger"
        onClick={() => destroy(raw)}
        disabled={raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">close</span>
        <p>Delete</p>
      </button>
    );
  };

  const viewBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__info"
        onClick={() => view(raw)}
      >
        <span className="material-icons-sharp">visibility</span>
        <p>View</p>
      </button>
    );
  };

  const bookingBodyTemplate = (raw) => {
    const { reservations } = raw?.attributes;

    const accepted =
      reservations.filter(
        (reserve) => reserve?.attributes?.accepted !== null
      )[0] ?? null;

    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__success"
        onClick={() => confirmBooking(raw)}
        disabled={
          accepted === null ||
          raw?.status === "confirmed" ||
          raw?.status === "canceled"
        }
      >
        <span className="material-icons-sharp">visibility</span>
        <p>{raw?.status === "confirmed" ? "Confirmed" : "Confirm"}</p>
      </button>
    );
  };

  const approveBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__success"
        onClick={() => approve(raw)}
        disabled={raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">check_circle</span>
        <p>Approve</p>
      </button>
    );
  };

  const assignBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="cs__table__btn cs__bg__success"
        onClick={() => assign(raw)}
        disabled={raw?.status !== "registered"}
      >
        <span className="material-icons-sharp">visibility</span>
        <p>View Request</p>
      </button>
    );
  };

  const header = () => {
    if (exportable) {
      return (
        <div className="cs__flex cs__justify__end cs__md__gap">
          <button
            type="button"
            className="cs__exports__btn cs__csv"
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
            disabled={exports.length < 1}
          >
            <span className="material-icons-sharp">article</span>
            <p>.CSV</p>
          </button>
          <button
            type="button"
            className="cs__exports__btn cs__xlsx"
            onClick={exportExcel}
            data-pr-tooltip="XLS"
            disabled={exports.length < 1}
          >
            <span className="material-icons-sharp">receipt_long</span>
            <p>.XLSX</p>
          </button>
          <button
            type="button"
            className="cs__exports__btn cs__pdf"
            onClick={exportPdf}
            data-pr-tooltip="PDF"
            disabled={exports.length < 1}
          >
            <span className="material-icons-sharp">picture_as_pdf</span>
            <p>.PDF</p>
          </button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="cs__table">
      {isSearchable && (
        <InputText
          className="cs__search__bar"
          placeholder="Search Data"
          onInput={(e) =>
            setFilters({
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
        />
      )}

      <DataTable
        header={header}
        value={data}
        ref={dt}
        filters={filters}
        paginator
        rows={rowsPerPage}
        rowsPerPageOptions={[2, 10, 25, 50, 100]}
        totalRecords={data?.length}
        scrollable
        scrollHeight="520px"
      >
        {columns.map((col, i) => {
          if (col.isArr) {
            return (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                sortable={col.isSortable}
                body={isArrayTemplate}
              />
            );
          } else {
            return (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                sortable={col.isSortable}
              />
            );
          }
        })}
        {manage !== undefined && <Column body={actionBodyTemplate} />}
        {confirmBooking !== undefined && <Column body={bookingBodyTemplate} />}
        {print !== undefined && <Column body={printBodyTemplate} />}
        {task !== undefined && <Column body={assignTaskBodyTemplate} />}
        {assign !== undefined && <Column body={assignBodyTemplate} />}
        {view !== undefined && <Column body={viewBodyTemplate} />}
        {approve !== undefined && <Column body={approveBodyTemplate} />}
        {close !== undefined && <Column body={closeRequestTemplate} />}
        {destroy !== undefined && <Column body={destroyBodyTemplate} />}
      </DataTable>
    </div>
  );
};

export default CSDatatable;
