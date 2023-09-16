import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import PageHeader from '../../../layouts/includes/PageHeader';
import CSDatatable from '../../../layouts/components/tables/CSDatatable';
import CUTickets from './CUTickets';
import Alert from '../../../services/alert';

const Tickets = () => {
    const [collection, setCollection] = useState([]);
    const [dependencies, setDependencies] = useState({});
    const [show, setShow] = useState(false);
    const [data, setData] = useState(undefined);
    const [isUpdating, setIsUpdating] = useState(false);

    const axios = useAxiosPrivate();

    const columns = [
        {
            field: "user",
            header: "Staff",
            isSortable: true,
        },
        {
            field: "issue",
            header: "Issue",
            isSortable: true,
        },
        {
            field: "department",
            header: "Department",
            isSortable: true,
        },
        {
            field: "location",
            header: "Location",
            isSortable: true,
        },
        {
            field: "floor",
            header: "Floor",
            isSortable: true,
        },
        {
            field: "description",
            header: "Description",
        },
        {
            field: "status",
            header: "Status",
        },
    ];

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

    const destroy = (data) => {
        //
        Alert.flash(
            "Are you sure?",
            "warning",
            "You will not be able to reverse this!!"
        ).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios
                        .delete(`tickets/${data?.id}`)
                        .then((res) => {
                            const response = res.data;
                            setCollection(collection.filter((coll) => coll.id !== data.id));
                            Alert.success("Deleted!!", response.message);
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
    };
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

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        try {
            const urls = ["tickets", "users", "departments", "issues", "locations", "floors",];

            const requests = urls.map((url) => axios.get(url));

            Promise.all(requests)
                .then((responses) => {
                    setCollection(responses[0].data?.data);
                    setDependencies({
                        users: responses[1].data?.data,
                        departments: responses[2].data?.data,
                        issues: responses[3].data?.data,
                        locations: responses[4].data?.data,
                        floors: responses[5].data?.data
                    });
                }
                )
                .catch((err) => console.error(err));
        } catch (error) {
            console.error(error);
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    console.log(collection)
    return (
        <>
            <CUTickets
                title="Create a Ticket"
                show={show}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                isUpdating={isUpdating}
                data={data}
                dependencies={dependencies}
            />
            <div className="row">
                <PageHeader
                    text="Tickets"
                    btnText="Create a Ticket"
                    handleClick={() => setShow(true)}
                />
                <div className="col-md-12">
                    <CSDatatable
                        columns={columns}
                        data={collection}
                        isSearchable
                        manage={manage}
                        destroy={destroy}
                    />
                </div>
            </div>
        </>
    )
}

export default Tickets
