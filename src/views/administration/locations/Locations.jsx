import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import CULocation from './CULocation';
import PageHeader from '../../../layouts/includes/PageHeader';
import CSDatatable from '../../../layouts/components/tables/CSDatatable';
import Alert from '../../../services/alert';

const Locations = () => {
    const [collection, setCollection] = useState();
    const [show, setShow] = useState(false);
    const [data, setData] = useState(undefined);
    const [isUpdating, setIsUpdating] = useState(false);

    const axios = useAxiosPrivate();

    const columns = [
        {
            field: 'name',
            header: 'Name',
            isSortable: true,
        },
        {
            field: 'hasFloors',
            header: 'Has Floors'
        }
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
        try {
            axios
                .get("locations")
                .then((res) => {

                    // const res_data = res.data.data.map(collection => {
                    //     return { ...collection, hasFloors: collection.hasFloors == 1 ? 'Yes' : 'No' }
                    // });
                    // setCollection(res_data);

                    setCollection(res.data.data);
                })
                .catch((err) => console.error(err.message));
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <>
            <CULocation
                title="Add Location"
                show={show}
                lg={false}
                isUpdating={isUpdating}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                data={data}
            />
            <div className="row">
                <PageHeader
                    text="Locations"
                    btnText="Create Location"
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




    );
}

export default Locations;