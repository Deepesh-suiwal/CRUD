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
        await instance.put(`/api/users/${data._id}`, {
          name: data.name,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          city: data.city,
          state: data.state,
        });
      } else {
        await instance.post("/api/users", {
          name: data.name,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          city: data.city,
          state: data.state,
        });
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
        setRefresh((prev) => !prev);
        setData({
          _id: user._id,
          name: user.name,
          email: user.email,
          dob: formattedDob,
          gender: user.gender,
          city: user.city,
          state: user.state,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter your name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="enter your email:"
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
            Select
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Enter your City"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Enter your State"
          value={data.state}
          onChange={(e) => setData({ ...data, state: e.target.value })}
          required
        />
        {isEditing ? (
          <button type="submit">Update Data</button>
        ) : (
          <button type="submit">Add Data</button>
        )}
      </form>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email})-{user.gender}, -(
            {new Date(user.dob).toLocaleDateString("en-US")}), -({user.city}),-
            ({user.state})
            <button
              style={{ margin: "3px" }}
              onClick={() => handleDelete(user._id)}
            >
              Delete
            </button>
            <button
              style={{ margin: "3px" }}
              onClick={() => handleEdit(user._id)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
