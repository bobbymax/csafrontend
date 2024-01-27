import PageHeader from "../../includes/PageHeader";
import CSDatatable from "../tables/CSDatatable";

const CollectionPage = ({
  name,
  btnText = "",
  clicakble = undefined,
  columns,
  data,
  isSearchable = false,
  bodyTemplate = undefined,
  destroy = undefined,
}) => {
  return (
    <>
      <div className="row">
        <PageHeader
          text={name}
          btnText={btnText}
          handleClick={() => clicakble()}
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={data}
            isSearchable={isSearchable}
            view={bodyTemplate}
            destroy={destroy}
          />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
