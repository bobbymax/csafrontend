import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Modal from '../../../layouts/components/modals/Modal';
import CSForm from '../../../layouts/components/forms/CSForm';
import CSInput from '../../../layouts/components/forms/CSInput';
import CSButton from '../../../layouts/components/forms/CSButton';

const CUStaffType = ({
    title = "",
    show = false,
    lg = false,
    isUpdating = false,
    handleClose = undefined,
    handleSubmit = undefined,
    data = undefined
}) => {

    const initialState = {
        id: 0,
        name: "",
    }

    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);

    const axios = useAxiosPrivate();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const body = {
            ...state,
        };

        try {
            setIsLoading(true);
            if (isUpdating) {
                axios
                    .patch(`staffTypes/${state.id}`, body)
                    .then((res) => {
                        const response = res.data;
                        handleSubmit({
                            status: "Updated!!",
                            data: response.data,
                            message: response.message,
                            action: "alter",
                        });
                        reset();
                    })
                    .catch((err) => console.error(err.message));
            } else {

                axios
                    .post("staffTypes/", body)
                    .then((res) => {
                        const response = res.data;
                        handleSubmit({
                            status: "Created!!",
                            data: response.data,
                            message: response.message,
                            action: "store",
                        });
                        reset();
                    })
                    .catch((err) => console.error(err.message));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleModalClose = () => {
        reset();
        handleClose();
    };

    const reset = () => {
        setIsLoading(false);
        setState(initialState);
    };

    useEffect(() => {
        if (data !== undefined) {
            setState({
                ...state,
                id: data?.id,
                name: data?.name,
            });

        }
    }, [data]);
    return (
        <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
            <CSForm
                txtHeader={title}
                lg={12}
                md={12}
                formSubmit={handleFormSubmit}
                noBorder
                noHeader
            >
                <div className="col-md-12 mb-3">
                    <CSInput
                        id="name"
                        label="Name"
                        placeholder="Enter Staff Type"
                        value={state.name}
                        onChange={(e) => setState({ ...state, name: e.target.value })}
                    />
                </div>

                <div className="col-md-12">
                    <CSButton
                        text="Submit"
                        type="submit"
                        variant="primary"
                        icon="send"
                        size="lg"
                        isLoading={isLoading}
                        block
                        disabled={state.name === ""}
                    />
                </div>
            </CSForm>
        </Modal>
    )
}

export default CUStaffType
