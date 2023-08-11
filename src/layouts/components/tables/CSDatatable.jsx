import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

const CSDatatable = ({
  columns,
  data,
  manage = undefined,
  print = undefined,
  isSearchable = false,
  destroy = undefined,
}) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const actionBodyTemplate = (raw) => {
    return (
      <button type="button" className="table__bttn" onClick={() => manage(raw)}>
        <span className="material-icons-sharp">settings</span>
      </button>
    );
  };

  const printBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__dark"
        onClick={() => print(raw)}
      >
        <span className="material-icons-sharp">print</span>
      </button>
    );
  };

  const destroyBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__danger"
        onClick={() => destroy(raw)}
      >
        <span className="material-icons-sharp">delete</span>
      </button>
    );
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
        value={data}
        filters={filters}
        paginator
        rows={10}
        rowsPerPageOptions={[2, 10, 25, 50, 100]}
        totalRecords={data?.length}
        scrollable
        scrollHeight="520px"
      >
        {columns.map((col, i) => (
          <Column
            key={i}
            field={col.field}
            header={col.header}
            sortable={col.isSortable}
          />
        ))}
        {manage !== undefined && <Column body={actionBodyTemplate} />}
        {print !== undefined && <Column body={printBodyTemplate} />}
        {destroy !== undefined && <Column body={destroyBodyTemplate} />}
      </DataTable>
    </div>
  );
};

export default CSDatatable;
