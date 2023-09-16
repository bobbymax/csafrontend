import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Modal from '../../../layouts/components/modals/Modal';
import CSForm from '../../../layouts/components/forms/CSForm';
import CSInput from '../../../layouts/components/forms/CSInput';
import CSButton from '../../../layouts/components/forms/CSButton';
import CSSelect from '../../../layouts/components/forms/CSSelect';
import CSSelectOptions from '../../../layouts/components/forms/CSSelectOptions';

const CUIssues = ({
    title = "",
    show = false,
    lg = false,
    isUpdating = false,
    handleClose = undefined,
    handleSubmit = undefined,
    data = undefined,
    dependencies = undefined,
}) => {
    const initialState = {
        id: 0,
        name: "",
        incident_category_id: 0,
        parentId: 0,
    };

    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [incidentCats, setIncidentCats] = useState([]);
    const [parents, setParents] = useState([]);

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
                    .patch(`issues/${state.id}`, body)
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
                    .post("issues", body)
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
        if (dependencies !== undefined && dependencies?.incidentCategories) {
            const { incidentCategories, issues } = dependencies;
            setIncidentCats(incidentCategories);
            setParents(issues)
        }
    }, [dependencies]);

    useEffect(() => {
        if (data !== undefined) {
            setState({
                ...state,
                id: data?.id,
                name: data?.name,
                incident_category_id: data?.incident_category_id,
                parentId: data?.parentId,
            });
        }
    }, [data]);

    return (
        <>
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
                            placeholder="Enter Issue Name"
                            value={state.name}
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <CSSelect
                            label="Incident Category"
                            value={state.incident_category_id}
                            onChange={(e) =>
                                setState({ ...state, incident_category_id: parseInt(e.target.value) })
                            }
                        >
                            <CSSelectOptions value={0} label="Select incident category" disabled />
                            {incidentCats?.map((dept) => (
                                <CSSelectOptions
                                    key={dept?.id}
                                    value={dept?.id}
                                    label={dept?.name}
                                />
                            ))}
                        </CSSelect>
                    </div>
                    {parents.length > 0 && <div className="col-md-12 mb-3">
                        <CSSelect
                            label="Parent Issue"
                            value={state.parentId}
                            onChange={(e) =>
                                setState({ ...state, parentId: parseInt(e.target.value) })
                            }
                        >
                            <CSSelectOptions value={0} label="None" />
                            {parents?.map((dept) => (
                                <CSSelectOptions
                                    key={dept?.id}
                                    value={dept?.id}
                                    label={dept?.name}
                                />
                            ))}
                        </CSSelect>
                    </div>}

                    <div className="col-md-12">
                        <CSButton
                            text="Submit"
                            type="submit"
                            variant="primary"
                            icon="send"
                            size="lg"
                            isLoading={isLoading}
                            block
                            disabled={state.name === "" || state.incident_category_id === 0}
                        />
                    </div>
                </CSForm>
            </Modal>
        </>
    )
}

export default CUIssues
