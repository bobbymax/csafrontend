import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import PageHeader from '../../../layouts/includes/PageHeader';
import CSDatatable from '../../../layouts/components/tables/CSDatatable';
import CUVehicleRequest from './CUVehicleRequest';
import Alert from '../../../services/alert';


const VehicleRequest = () => {
    const [collection, setCollection] = useState([]);
    const [dependencies, setDependencies] = useState({});
    const [show, setShow] = useState(false);
    const [data, setData] = useState(undefined);
    const [isUpdating, setIsUpdating] = useState(false);

    const axios = useAxiosPrivate();

    const columns = [
        {
            field: "user",
            header: "User",
            isSortable: true,
        },
        {
            field: "destination",
            header: "Destination",
            isSortable: true,
        },
        {
            field: "stock_type",
            header: "Product Type",
            isSortable: true,
        },
        {
            field: "required_date",
            header: "Date Required",
            isSortable: true,
        },
        {
            field: "return_date",
            header: "Return Date",
            isSortable: true,
        },
        {
            field: "duration",
            header: "No of Days",
            // isSortable: true,
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
                        .delete(`vehicleRequests/${data?.id}`)
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
            const urls = ["vehicleRequests", "users", "stockTypes", "locations"];

            const requests = urls.map((url) => axios.get(url));

            Promise.all(requests)
                .then((responses) => {
                    setCollection(responses[0].data?.data);
                    setDependencies({
                        users: responses[1].data?.data,
                        stockTypes: responses[2].data?.data,
                        locations: responses[3].data?.data,
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
            <CUVehicleRequest
                title="Create a New Request"
                show={show}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                isUpdating={isUpdating}
                data={data}
                dependencies={dependencies}
            />
            <div className="row">
                <PageHeader
                    text="Vehicle Requests"
                    btnText="Create a New Request"
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

export default VehicleRequest
