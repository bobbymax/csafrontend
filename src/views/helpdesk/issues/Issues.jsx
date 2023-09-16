import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import PageHeader from '../../../layouts/includes/PageHeader';
import CSDatatable from '../../../layouts/components/tables/CSDatatable';
import Alert from '../../../services/alert';
import CUIssues from './CUIssues';

const Issues = () => {
    const [collection, setCollection] = useState([]);
    const [incidentCats, setIncidentCats] = useState([]);
    const [show, setShow] = useState(false);
    const [data, setData] = useState(undefined);
    const [isUpdating, setIsUpdating] = useState(false);

    const axios = useAxiosPrivate();

    const columns = [
        {
            field: "name",
            header: "Name",
            isSortable: true,
        },
    ];

    const handleSubmit = (response) => {
        if (response?.action === "alter") {
            setCollection(
                collection.map((collects) => {
                    if (collects.id == response?.data?.id) {
                        return response?.data;
                    }

                    return collects;
                })
            );
        } else {
            setCollection([response?.data, ...collection]);
        }

        Alert.success(response?.status, response?.message);
        handleClose();
    };

    const handleClose = () => {
        setShow(false);
        setIsUpdating(false);
        setData(undefined);
    };

    const manage = (raw) => {
        setData(raw);
        setIsUpdating(true);
        setShow(true);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        try {
            const urls = ["issues", "incidentCategories"];

            const requests = urls.map((url) => axios.get(url));

            Promise.all(requests)
                .then((responses) => {
                    setCollection(responses[0].data?.data);
                    setIncidentCats(responses[1].data?.data);
                })
                .catch((err) => console.error(err));
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
            <CUIssues
                title="Add Issue"
                show={show}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                isUpdating={isUpdating}
                data={data}
                dependencies={{ incidentCategories: incidentCats, issues: collection }}
            />
            <div className="row">
                <PageHeader
                    text="Issues"
                    btnText="Create Issue"
                    handleClick={() => setShow(true)}
                />
                <div className="col-md-12">
                    <CSDatatable
                        columns={columns}
                        data={collection}
                        isSearchable
                        manage={manage}
                    />
                </div>
            </div>
        </>
    )
}

export default Issues
