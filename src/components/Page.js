import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

const Page = () => {
  const pageSize = 50;
  const [comn, setComn] = useState();
  const [paginated, setPaginated] = useState();
  const [currentpage, setCurrentpage] = useState(1);
  const [input,setInput] = useState("");
  const [order,setOrder] = useState("ASC");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res) => {
        setComn(res.data);
        setPaginated(_(res.data).slice(0).take(pageSize).value());
      })
      .catch((err) => console.log(err.name));
  }, []);

  const handleChange = e => {
    e.preventDefault()
    setInput(e.target.value.toLowerCase())
  }

  const sorting = (col) => {
    if(order === 'ASC')
    {
      const sorted = [...paginated].sort((a,b) => {
        if(col === 'id')
        {
          return a[col] > b[col] ? 1 : -1
        }
        else{
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1

        }
      }
        
      )
      setPaginated(sorted)
      setOrder("DSC")
    }
    else if(order === 'DSC')
    {
      const sorted = [...paginated].sort((a,b) => 
      {
        if(col === 'id')
        {
          return a[col] < b[col] ? 1 : -1
        }
        else{
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1

        }
      }
      )
      setPaginated(sorted)
      setOrder("ASC")
    }
  }

  const pageCount = comn ? Math.ceil(comn.length / pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  // console.log(comn)

  const pagin = (pageNo) => {
    setCurrentpage(pageNo);
    const startI = (pageNo - 1) * pageSize;
    const paginatedComn = _(comn).slice(startI).take(pageSize).value();
    setPaginated(paginatedComn);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col mt-2 ml-3">
          <ul className="pagination">
            {pages.map((p) => (
              <li
                className={p === currentpage ? "page-item active" : "page-item"}
              >
                <p className="page-link" onClick={() => pagin(p)}>
                  {p}
                </p>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col mt-2 text-primary"><h1>Dooooodle</h1></div>
        <div className="col mt-2">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search by name"
              aria-label="Search by name"
              aria-describedby="button-addon2"
              onChange={handleChange} 
              value={input}
            />
            <button
              class="btn btn-outline-primary"
              type="button"
              id="button-addon2"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      {!paginated ? (
        "Loading"
      ) : (
        <table className="table" id="myTable">
          <thead className="bg-primary text-white">
            <th onClick={() => sorting('id')}>Id</th>
            <th onClick={() => sorting('name')}>Name</th>
            <th onClick={() => sorting('email')}>Email</th>
            <th onClick={() => sorting('body')}>Message</th>
          </thead>
          <tbody>
            {paginated.filter(val => {
              if(input === "") 
              {
                return val
              }
              if(val.name.toLowerCase().includes(input))
              {
                return val
              }
            }
            ).map((post, index) => (
              <tr key={index}>
                <td style={{ fontWeight: "bold" }}>{post.id}</td>
                <td>{post.name}</td>
                <td>{post.email}</td>
                <td>{post.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Page;
