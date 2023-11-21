import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Escalate from "./Escalate";
import { useAppContext } from "../../../context/AuthProvider";
import CSBox from "../../../layouts/components/forms/CSBox";
import Alert from "../../../services/alert";
import CSButton from "../../../layouts/components/forms/CSButton";

const ManageComplaint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { auth } = useAppContext();

  const [users, setUsers] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [staff, setStaff] = useState(null);
  const [task, setTask] = useState(null);
  const [escalateShow, setEscalateShow] = useState(false);
  const [canClose, setCanClose] = useState(false);

  const [status, setStatus] = useState("");
  const [todos, setTodos] = useState([]);

  const handleSubmit = (response) => {
    // console.log(response);
    setComplaint(response);
    navigate("/helpdesk/complaints");

    handleClose();
  };

  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const value = parseInt(e.target.value);

    Alert.flash(
      "Are you sure?",
      "info",
      "You are about to make this event as completed!!"
    ).then((result) => {
      if (result.isConfirmed) {
        const body = {
          status: "completed",
        };
        try {
          axios
            .patch(`todos/${value}`, body)
            .then((res) => {
              const response = res.data;
              setTodos(
                todos.map((todo) => {
                  if (todo.id === response.data.id) {
                    return response.data;
                  }

                  return todo;
                })
              );
              Alert.success("Updated!!", response.message);
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });

    // console.log(isChecked, value);
  };

  const handleModal = (stat) => {
    setStatus(stat);
    setEscalateShow(true);
  };

  const handleClose = () => {
    setEscalateShow(false);
    // setStatus("");
  };

  const closeTicket = () => {
    const body = {
      status: "completed",
    };

    try {
      axios
        .patch(`resolve/tickets/${complaint?.id}`, body)
        .then((res) => {
          Alert.success("Resolved!!", res.data?.message);
          navigate("/helpdesk/complaints");
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (task !== null) {
      const { todos } = task;

      setTodos(todos);
    }
  }, [task]);

  useEffect(() => {
    const close = todos.filter((todo) => todo.status !== "completed");
    // console.log(close);
    setCanClose(close.length === 0);
  }, [todos]);

  //   console.log(canClose);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("department/staff")
        .then((res) => {
          setUsers(res.data?.data);
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (location && location.state !== null && location.state?.complaint) {
      const { complaint } = location.state;
      setComplaint(complaint);
      setStaff(complaint?.attributes?.staff);
      setTask(complaint?.attributes?.task);
    }
  }, [location]);

  //   console.log(todos);

  return (
    <>
      <Escalate
        title="Update Task"
        show={escalateShow}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={complaint}
        dependencies={users.filter(
          (user) => user?.id !== parseInt(auth?.user?.id)
        )}
        status={status}
      />

      <div className="row">
        <PageHeader
          text="Manage Complaint"
          icon="settings"
          btnText="Go Back"
          btnIcon="arrow_back"
          variant="danger"
          handleClick={() => navigate(-1)}
        />
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="complaint__details">
                <h3 className="mb-3">Complaint</h3>
                <p>{`${staff?.name} has reported a ${complaint?.attributes?.issue?.name} incident around ${complaint?.office_number} that needs our attention as soon as possible. Further details on this incident as described by ${staff?.name} is "${complaint?.description}" with a ${complaint?.priority} severity level.`}</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="complaint__details">
                <h3 className="mb-3">Task</h3>
                <p className="mb-3">{task?.description}</p>
                <div className="task__btn__group">
                  <button
                    type="button"
                    className="cs__bttn info"
                    onClick={() => handleModal("escalated")}
                    disabled={
                      complaint?.escalated >= 3 ||
                      complaint?.status === "resolved" ||
                      task?.status === "completed"
                    }
                  >
                    Escalate
                  </button>
                  <button
                    type="button"
                    className="cs__bttn danger"
                    onClick={() => handleModal("todo")}
                    disabled={
                      complaint?.status === "resolved" ||
                      task?.status === "completed"
                    }
                  >
                    Add TODO
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <div className="complaint__details">
                {todos?.length > 0 ? (
                  todos?.map((todo, i) => (
                    <div
                      className={`todo__description mb-2 ${
                        todo.status === "completed" ? "line__through" : ""
                      }`}
                      key={i}
                    >
                      <CSBox
                        value={todo?.id}
                        onChange={handleChange}
                        disabled={todo.status === "completed"}
                        checked={todo.status === "completed"}
                        noMargin
                      />
                      <p>{todo?.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-danger">
                    No activities have been added to this task
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 mt-4">
              <CSButton
                text="Close out Task"
                icon="close"
                handleClick={() => closeTicket()}
                variant="dark"
                disabled={
                  !canClose ||
                  complaint?.status === "resolved" ||
                  task?.status === "completed" ||
                  todos?.length < 1
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageComplaint;
