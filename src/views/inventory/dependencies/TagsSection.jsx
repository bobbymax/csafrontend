import { useState } from "react";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const TagsSection = ({
  columns = [],
  collection = [],
  handleSubmit = undefined,
  loading = false,
}) => {
  const initialTagState = {
    id: 0,
    name: "",
  };

  const [tagState, setTagState] = useState(initialTagState);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagUpdating, setIsTagUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...tagState,
    };

    try {
      handleSubmit(
        "tags",
        body,
        isTagUpdating ? "alter" : "store",
        tagState.id
      );
      reset();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const manage = (raw) => {
    setTagState({
      ...tagState,
      id: raw?.id,
      name: raw?.name,
    });

    setIsTagUpdating(true);
  };

  const reset = () => {
    setIsLoading(false);
    setIsTagUpdating(false);
    setTagState(initialTagState);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <CSForm
          txtHeader={isTagUpdating ? "Update Tag" : "Add Tag"}
          lg={12}
          md={12}
          formSubmit={handleFormSubmit}
        >
          <div className="col-md-12 mb-5">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Tag Name"
              value={tagState.name}
              onChange={(e) =>
                setTagState({ ...tagState, name: e.target.value })
              }
            />
          </div>

          <div className="col-md-12">
            <CSButton
              text={isTagUpdating ? "Update Tag" : "Add Tag"}
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading || loading}
              block
              disabled={tagState.name === ""}
            />
          </div>
        </CSForm>
      </div>
      <div className="col-md-7">
        <CSDatatable
          columns={columns}
          data={collection}
          isSearchable
          manage={manage}
          rowsPerPage={2}
        />
      </div>
    </div>
  );
};

export default TagsSection;
