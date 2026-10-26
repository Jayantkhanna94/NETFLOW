import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Download, Plus, Pencil, Trash2, X } from "../components/Icons";
import { getData, saveData, newId, exportCSV } from "../services/storage";
import { Card, Header, Button, SearchBox, Status, FormField, Input, Select } from "../components/UI";
import { validateRequired, validateEmail } from "../services/validation";

export default function Users({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;

  const [rows, setRows] = useState(() => getData("users"));
  const [q, setQ] = useState(globalQuery);
  const [edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const nameInputRef = useRef(null);

  const [f, setF] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active",
  });

  // Sync global search from topbar
  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Focus first input on modal open (DOM manipulation via ref)
  useEffect(() => {
    if (edit) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [edit]);

  const list = rows.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(f.name, "Full Name");
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(f.email);
    if (emailErr) errs.email = emailErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  function save(e) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!validate()) return;

    const n =
      edit && !edit.new
        ? rows.map((x) => (x.id === edit.id ? { ...f, id: x.id } : x))
        : [...rows, { ...f, id: newId("U") }];
    setRows(n);
    saveData("users", n);
    setEdit(null);
    setErrors({});
    setTouched({});
  }

  return (
    <Card>
      <Header
        title="User Management"
        subtitle={`${rows.length} registered users`}
        action={
          <div className="actions">
            <Button
              variant="ghost"
              icon={<Download size={15} />}
              onClick={() => exportCSV("netflow-users.csv", list)}
            >
              Export CSV
            </Button>
            <Button
              icon={<Plus size={15} />}
              onClick={() => {
                setF({
                  name: "",
                  email: "",
                  role: "Student",
                  status: "Active",
                });
                setEdit({ new: true });
                setErrors({});
                setTouched({});
              }}
            >
              Add User
            </Button>
          </div>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search users by name, email, or role..." />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="table-avatar">
                      {u.name
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <b>{u.name}</b>
                      <small>{u.id}</small>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className="role">{u.role}</span>
                </td>
                <td>
                  <Status value={u.status} />
                </td>
                <td>
                  <button
                    className="icon-btn sm"
                    onClick={() => {
                      setEdit(u);
                      setF(u);
                      setErrors({});
                      setTouched({});
                    }}
                    aria-label="Edit user"
                    title="Edit user"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="icon-btn sm"
                    onClick={() => {
                      if (confirm("Delete this user?")) {
                        const n = rows.filter((x) => x.id !== u.id);
                        setRows(n);
                        saveData("users", n);
                      }
                    }}
                    aria-label="Delete user"
                    title="Delete user"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="modal-bg" role="dialog" aria-modal="true">
          <form className="modal" onSubmit={save}>
            <div className="modal-head">
              <h2>{edit.new ? "Add user" : "Edit user"}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setEdit(null)}
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            </div>

            <Input
              inputRef={nameInputRef}
              id="user-name"
              label="Full Name"
              required
              value={f.name}
              onChange={(val) => setF({ ...f, name: String(val) })}
              onBlur={() => handleBlur("name")}
              error={errors.name}
              touched={touched.name}
              placeholder="e.g. Priya Sharma"
            />

            <Input
              id="user-email"
              label="Email Address"
              type="email"
              required
              value={f.email}
              onChange={(val) => setF({ ...f, email: String(val) })}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              touched={touched.email}
              placeholder="name@college.edu"
            />

            <div className="two-col">
              <Select
                id="user-role"
                label="Role"
                value={f.role}
                onChange={(e) => setF({ ...f, role: e.target.value })}
                options={["Student", "Faculty", "Administrator"]}
              />

              <Select
                id="user-status"
                label="Status"
                value={f.status}
                onChange={(e) => setF({ ...f, status: e.target.value })}
                options={["Active", "Inactive"]}
              />
            </div>

            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save User</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export { Users, Users as UsersPage };
