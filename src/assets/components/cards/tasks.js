import moment from "moment";

export const TaskContainer = ({ mt = 0, mb = 0, children }) => {
  return (
    <>
      <div id="task__card" className={`mt-${mt} mb-${mb}`}>
        <div className="row">{children}</div>
      </div>
    </>
  );
};

export const TaskColumn = ({
  title = "",
  status = "",
  color = "cs__pending",
  items = [],
  handleItem = undefined
}) => {
  return (
    <div className="col-md-3">
      <div className="task__col">
        <div className="task__col-head">
          <span className={color}>{items?.filter(item => item?.status === status).length}</span>
          <h3>{title}</h3>
        </div>
        <div className="task__col-body">
          {items?.length > 0 ? items?.map((item, i) => {
            if (item?.status === status) {
              return (
                <TaskItems 
                  key={i}
                  description={item?.description}
                  category={item?.activity}
                  date={item?.created_at}
                  raw={item}
                  status={item?.status}
                  manage={() => handleItem(item)}
                />
              )
            }
          }) : "No items here"}
        </div>
      </div>
    </div>
  )
}

export const TaskItems = ({
  category, 
  description = "", 
  date, 
  count = 0, 
  status = "",
  period,
  raw,
  manage
}) => {
  return (
    <article className="task__items">
      <div className="topic">
        <span className={`task__activity ${category}`}>{category}</span>
        <span className="material-icons-sharp view__more" onClick={() => manage(raw)}>more_horiz</span>
      </div>
      <div className="content">
        <p>{description}</p>
      </div>
      <div className="article__footer">
        <div className="spec">
          <div className="date">
            <span className="material-icons-sharp">event</span>
            <p>{moment(date).format("LL")}</p>
          </div>
          <div className="todos">
            <span className="material-icons-sharp">assignment</span>
            <p>{count} todos</p>
          </div>
        </div>
        <span className={`material-icons-sharp timer ${status}`}>
          timelapse
        </span>
      </div>
    </article>
  )
}