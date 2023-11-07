import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import BrandSection from "./BrandSection";
import Alert from "../../../services/alert";
import InventoryCategorySection from "./InventoryCategorySection";
import StockCategoriesSection from "./StockCategoriesSection";
import StockTypesSection from "./StockTypesSection";
import TagsSection from "./TagsSection";

const StockDependencies = () => {
  const [brands, setBrands] = useState([]);
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [stockCategories, setStockCategories] = useState([]);
  const [stockTypes, setStockTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
  ];

  const updateCollection = (url, collection, method) => {
    switch (url) {
      case "brands":
        if (method === "alter") {
          setBrands(
            brands.map((item) => {
              if (item.id === collection.id) {
                return collection;
              }

              return item;
            })
          );
        } else {
          setBrands([collection, ...brands]);
        }
        break;
      case "inventoryCategories":
        if (method === "alter") {
          setInventoryCategories(
            inventoryCategories.map((item) => {
              if (item.id === collection.id) {
                return collection;
              }

              return item;
            })
          );
        } else {
          setInventoryCategories([collection, ...inventoryCategories]);
        }
        break;
      case "stockCategories":
        if (method === "alter") {
          setStockCategories(
            stockCategories.map((item) => {
              if (item.id === collection.id) {
                return collection;
              }

              return item;
            })
          );
        } else {
          setStockCategories([collection, ...stockCategories]);
        }
        break;
      case "stockTypes":
        if (method === "alter") {
          setStockTypes(
            stockTypes.map((item) => {
              if (item.id === collection.id) {
                return collection;
              }

              return item;
            })
          );
        } else {
          setStockTypes([collection, ...stockTypes]);
        }
        break;
      case "tags":
        if (method === "alter") {
          setTags(
            tags.map((item) => {
              if (item.id === collection.id) {
                return collection;
              }

              return item;
            })
          );
        } else {
          setTags([collection, ...tags]);
        }
        break;

      default:
        break;
    }
  };

  const handleSubmit = (url, data, method, dataId = 0) => {
    try {
      setIsLoading(true);
      if (method === "alter") {
        axios
          .patch(`${url + "/" + dataId}`, data)
          .then((res) => {
            const response = res.data;
            updateCollection(url, response.data, method);
            Alert.success("Updated!!", response.message);
            setIsLoading(false);
          })
          .catch((err) => console.error(err.message));
      } else {
        axios
          .post(url, data)
          .then((res) => {
            const response = res.data;
            updateCollection(url, response.data, method);
            Alert.success("Created!!", response.message);
            setIsLoading(false);
          })
          .catch((err) => console.error(err.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = [
        "brands",
        "inventoryCategories",
        "stockCategories",
        "stockTypes",
        "tags",
        "departments",
      ];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((res) => {
          setBrands(res[0].data.data);
          setInventoryCategories(res[1].data.data);
          setStockCategories(res[2].data.data);
          setStockTypes(res[3].data.data);
          setTags(res[4].data.data);
          setDepartments(res[5].data.data);
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
      <div className="row">
        <PageHeader text="Stock Dependencies" icon="inventory_2" />

        <div className="brand__section mb-4">
          <BrandSection
            columns={columns}
            collection={brands}
            handleSubmit={handleSubmit}
            loading={isLoading}
          />
        </div>

        <div className="inventory__categories__section mb-4">
          <InventoryCategorySection
            columns={columns}
            collection={inventoryCategories}
            handleSubmit={handleSubmit}
            departments={departments}
            loading={isLoading}
          />
        </div>
        <div className="stock__categories__section mb-4">
          <StockCategoriesSection
            columns={columns}
            collection={stockCategories}
            handleSubmit={handleSubmit}
            inventoryCategories={inventoryCategories}
            loading={isLoading}
          />
        </div>
        <div className="stock__types__section mb-4">
          <StockTypesSection
            columns={columns}
            collection={stockTypes}
            handleSubmit={handleSubmit}
            stockCategories={stockCategories}
            loading={isLoading}
          />
        </div>
        <div className="tags__section mb-4">
          <TagsSection
            columns={columns}
            collection={tags}
            handleSubmit={handleSubmit}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default StockDependencies;
