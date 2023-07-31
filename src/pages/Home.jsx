import CSInput from "../layouts/components/forms/CSInput";
import CSSelect from "../layouts/components/forms/CSSelect";
import CSSelectOptions from "../layouts/components/forms/CSSelectOptions";
import CSTextarea from "../layouts/components/forms/CSTextarea";
import CSBox from "../layouts/components/forms/CSBox";
import CSButton from "../layouts/components/forms/CSButton";
import CSDatatable from "../layouts/components/tables/CSDatatable";

const Home = () => {
  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "level",
      header: "Grade Level",
      isSortable: false,
    },
  ];

  const data = [
    {
      name: "Olisaemeka Isife",
      level: "SS7",
    },
    {
      name: "Mohammed Sirajo",
      level: "SS7",
    },
    {
      name: "Ekaro Bobby Tamunotonye",
      level: "SS3",
    },
    {
      name: "Olawale Osikoya",
      level: "SS3",
    },
  ];

  // console.log(auth);

  return (
    <div className="row">
      <div className="col-md-5 col-sm-12">
        <div className="form__card">
          <div className="form__card__header">
            <h3>Card Header</h3>
          </div>
          <div className="form__card__body">
            <form>
              <CSInput
                label="Email Address"
                id="email"
                placeholder="Enter Email Address"
              />
              <CSSelect label="Department">
                <CSSelectOptions label="Select Department" value="" />
              </CSSelect>
              <CSTextarea
                label="Description"
                placeholder="Enter Description here..."
                rows={4}
              />
              <CSBox label="Super Administrator" />

              <CSButton
                type="submit"
                text="Default"
                icon="dashboard"
                variant="primary"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-7 col-sm-12">
        <CSDatatable columns={columns} data={data} isSearchable />
      </div>
    </div>
  );
};

export default Home;
