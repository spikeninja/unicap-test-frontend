import axios from "axios";
import { Formik } from "formik";
import { useState, useRef } from "react";

import Button from "@mui/material";
import Select from "@mui/material";
import InputLabel from "@mui/material";
import MenuItem from "@mui/material";

import { API_URL } from "../api/assistant";
import Product from "../components/Product";
import { useAuthStore } from "../store/main";
import Spinner from "../components/Spinner/Spinner";


const MainPage = () => {
  const myInterval = useRef(null)
  const { token } = useAuthStore(state => state)

  const [pages, setPages] = useState<Array<any>>([])
  const [data, setData] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(false);

  // Long-Polling crutch
  const handleTaskStatus = (taskId: any) => {
    axios.get(`${API_URL}/api/parsers/results/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then((res) => {
      if (res.data.status === "SUCCESS") {
        // @ts-ignore
        clearInterval(myInterval.current)
        setIsLoading(false);
        setPages(res.data.pages);
        setData(res.data.pages[0].products)
        return res.data;
      }
    });
  };

  const handleSubmit = async (values: {category: string}) => {
    const payload = {
      category: values.category,
    };

    console.log('payload: ', values)

    const res = await axios.post(`${API_URL}/api/parsers`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if(res.status === 200) {
      // cached: {page: 1, data: [], }
      const { task_id: taskId, cached } = res.data;
      console.log('res: ', res)
      setIsLoading(true);
      // @ts-ignore
      myInterval.current = setInterval(() => {handleTaskStatus(taskId)}, 1000);
    }
  };

  return (
    <div>
      <h1>OLX Parser </h1>
      <h3>Choose a category from the list and press PARSE button</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 10,
          rowGap: 10,
          alignItems: "center",
        }}
      >
        <div>
          {isLoading && <Spinner />}
        </div>
        <Formik
          initialValues={{
            category: "",
          }}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <>
              <div style={{
                flexDirection: 'column',
                paddingTop: 5,
                paddingBottom: 10,
              }}>
              <InputLabel id="category-selector">Category</InputLabel>
              <Select 
                labelId="category-selector"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange("category")}
                onBlur={formik.handleBlur}
              >
                <MenuItem defaultChecked value="cars" label="cars">Cars</MenuItem>
                <MenuItem value="electronics" label="electronics">Electronics</MenuItem>
                <MenuItem value="sport" label="sport">Sport</MenuItem>
                <MenuItem value="motorbike_parts" label="motorbike_parts">Motorbike Parts</MenuItem>
              </Select>
              <Button
                variant="contained"
                // @ts-ignore
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
                style={{
                  marginLeft: 15,
                  fontSize: 18,
                }}
              >
                Parse
              </Button>
              </div>
            </>
          )}
        </Formik>
        <div>Pages: {
          pages.map((_, idx: number) => (
            <a
              style={{ padding: 5, cursor: 'pointer'}}
              onClick={() => {
                setData(pages[idx].products)
              }}
            >{idx + 1}</a>
          ))  
        }</div>
        <div className="productsList">
          {data.length === 0 || data === null ? <p>No data yet</p> : null}
          {data && data.map(item => (
          <Product 
            name={item.name}
            location={item.location}
            imageUrl={item.image_src}
            state={item.state}
            productUrl={item.product_url}
          />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
