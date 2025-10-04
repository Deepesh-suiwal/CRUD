import { useEffect, useState } from "react";
import instance from "./axiosConfig";

function App() {
  const [data, setData] = useState({
    _id: "",
    name: "",
    email: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
  });
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function displayAlluser() {
      try {
        const res = await instance.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    }
    displayAlluser();
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsEditing(false);
    try {
      if (data._id) {
        await instance.put(`/api/users/${data._id}`, data);
      } else {
        await instance.post("/api/users", data);
      }

      setData({
        _id: "",
        name: "",
        email: "",
        dob: "",
        gender: "",
        city: "",
        state: "",
      });

      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error submitting data", err);
    }
  }

  async function handleDelete(id) {
    try {
      await instance.delete(`/api/users/${id}`);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error deleting user", err);
    }
  }

  async function handleEdit(id) {
    setIsEditing(true);
    try {
      const user = users.find((user) => user._id === id);
      if (user) {
        const formattedDob = new Date(user.dob).toISOString().split("T")[0];
        setData({ ...user, dob: formattedDob });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app-container">
      <h1 className="title">User Management System</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
        <input
          type="date"
          value={data.dob}
          onChange={(e) => setData({ ...data, dob: e.target.value })}
          required
        />
        <select
          value={data.gender}
          onChange={(e) => setData({ ...data, gender: e.target.value })}
          required
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Enter your city"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Enter your state"
          value={data.state}
          onChange={(e) => setData({ ...data, state: e.target.value })}
          required
        />
        <button type="submit" className="submit-btn">
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      <div className="user-list">
        <h2>All Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="user-card">
              <div className="user-info">
                <p>
                  <strong>{user.name}</strong> ({user.email})
                </p>
                <p>
                  {user.gender},{" "}
                  {new Date(user.dob).toLocaleDateString("en-US")}
                </p>
                <p>
                  {user.city}, {user.state}
                </p>
              </div>
              <div className="user-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(user._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
