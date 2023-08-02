import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Alert from '../../../services/alert';
import CUFloor from './CUFloor';
import PageHeader from '../../../layouts/includes/PageHeader';
import CSDatatable from '../../../layouts/components/tables/CSDatatable';

const Floors = () => {
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
            field: 'number',
            header: 'Floor Number',
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
        try {
            axios
                .get("floors")
                .then((res) => {
                    setCollection(res.data.data);
                })
                .catch((err) => console.error(err.message));
        } catch (error) {
            console.error(error);
        }
    }, []);
    return (
        <>
            <CUFloor
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
                    text="Floors"
                    btnText="Create Floor"
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

export default Floors
