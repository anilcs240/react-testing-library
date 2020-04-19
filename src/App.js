import React, { useState, useEffect } from "react";
import { fetchUsers } from "./Services/user.service";
import { selectedClass } from "./constants/const";
import Loader from "./components/loader/Loader";
import "./App.css";

function App() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [loader, setLoaderState] = useState(false);
  const [hasError, setErrors] = useState(false);
  const [scoreRanges, setScroreRanges] = useState([]);

  // fetch user data
  async function fetchUserData() {
    try {
      setLoaderState(true);
      let res = await fetchUsers();
      setScroreRanges(res);
      setLoaderState(false);
    } catch (error) {
      setErrors(true);
      setScroreRanges([]);
      setLoaderState(false);
    }
  }

  // select row
  const selectRow = selectedItem => {
    setSelectedRow(selectedItem);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="user-list">
      {loader && <Loader />}
      {(scoreRanges?.length === 0 || hasError) && !loader && (
        <b data-testid="noData">No Data Available!</b>
      )}
      {scoreRanges?.length > 0 && !loader && (
        <table>
        <caption>Users List</caption>
          <thead>
            <tr>
              <th scope="col">user name</th>
              <th scope="col">email</th>
              <th scope="col">phone</th>
              <th scope="col">website</th>
            </tr>
          </thead>
          <tbody data-testid="userList">
            {scoreRanges.map(user => (
              <tr
                data-testid={user.id}
                onClick={() => selectRow(user.id)}
                className={selectedRow === user.id ? selectedClass : ""}
                key={user.id}
              >
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
