import React, { useEffect, useState } from "react";
import "./Home.css";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { FcAlarmClock } from "react-icons/fc";
import {GrInProgress} from "react-icons/gr"
import {BsCheck2All} from "react-icons/bs"


const Home = () => {
  const [addSection, setAddSection] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [dataList, setDataList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [id, setId] = useState("");
  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
     setFormError(validation(formData));
    
    setIsSubmit(true);

    try {
      let data;
      // creating new Data
    
      if (update == false) {
        data = await axios.post(
          "http://localhost:5000/api/v1/createData",
          formData
        );
      }
      //Updating exisiting Data
      else{
        data = await axios.put(
          "http://localhost:5000/api/v1/updateData/" + id,
          formData
        );
      }
      console.log(data);
      if (data.data.success) {
        setAddSection(false);
        setFormData({
          title: "",
          description: "",
          status: "",
        });
        alert(data.data.message);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/v1/getData");
      console.log(data);
      if (data.data.success) {
        setDataList(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(
        `http://localhost:5000/api/v1/deleteData/${id}`
      );
      if (data.data.success) {
        getData();
        alert(data.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (d) => {
    setUpdate(true);
    setId(d._id);
    setAddSection(true);
    setFormData({
      title: d.title,
      description: d.description,
      status: d.status,
    });
  };

  const validation = (formData) => {
    const errors = {};
   
    if (!formData.title) {
      errors.title = "title is Reqruired!";
    }
    if (!formData.description) {
      errors.description = "description is Reqruired!";
    } 
    if (!formData.status) {
      errors.status = "Status is required!";
    } 
    // else if (
    //   !["Todo", "In Progress", "Completed"].includes(formData.status)
    // ) {
    //   errors.status = "Invalid status!";
    // }
    return errors;
  };
  useEffect(() => {
    if (Object.keys(formError).length === 0 && isSubmit) {
      console.log(formData);
    }
  }, [formError]);
  return (
    <div className="container">
      <button className="btn btn-add" onClick={() => setAddSection(true)}>
        Add
      </button>
      {addSection && (
        <div className="addContainer">
          <form onSubmit={handleSubmit}>
            <div className="close-btn" onClick={() => setAddSection(false)}>
              <MdClose />
            </div>
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, ["title"]: e.target.value })
              }
            />
            <p className="Validation">{formError.title}</p>
            <label htmlFor="description">description: </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, ["description"]: e.target.value })
              }
            />
            <p className="Validation">{formError.description}</p>
            <label htmlFor="status">status: </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, ["status"]: e.target.value })
              }
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <p className="Validation">{formError.status}</p>
            <button className="btn">Submit</button>
          </form>
        </div>
      )}
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList[0] ? (
              dataList.map((d) => {
                const statusClass = d.status === 'Todo' ? 'red-text' : d.status === 'In Progress' ? 'yellow-text' : 'green-text';
                return (
                  <tr
                 
                  >
                    <td>{d.title}</td>
                    <td>{d.description}</td>
                    <td className={statusClass}>
                    {d.status === "Todo" ? (
              <>
                <FcAlarmClock style={{ marginRight: "0.5rem" }} />
                {d.status}
              </>
            ) : d.status === "In Progress" ? (
              <>
                <GrInProgress style={{ marginRight: "0.5rem"}} />
                {d.status}
              </>
            ) : d.status === "Completed" ? (
              <>
                <BsCheck2All style={{ marginRight: "0.5rem", color: "green" }} />
                {d.status}
              </>
            ) : (
              d.status
            )}



                      </td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleUpdate(d)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(d._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <p style={{ textAlign: "center" }}>No data</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
