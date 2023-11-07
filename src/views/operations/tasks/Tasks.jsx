import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {
  TaskColumn,
  TaskContainer,
} from "../../../assets/components/cards/tasks";
import { cols } from "../../../assets/data/api";
import { useAppContext } from "../../../context/AuthProvider";

const Tasks = () => {
  const [collection, setCollection] = useState([]);

  const { auth } = useAppContext();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const handleItem = (item) => {
    console.log(item);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("tasks")
        .then((res) => {
          const response = res.data.data;
          setCollection(response);
        })
        .catch((err) => {
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader text="Tasks" icon="task_alt" />

      <TaskContainer mt={5}>
        {cols.map((col, i) => (
          <TaskColumn
            key={i}
            title={col.title}
            color={col.color}
            status={col.status}
            items={collection}
            handleItem={handleItem}
          />
        ))}
      </TaskContainer>
    </>
  );
};

export default Tasks;
