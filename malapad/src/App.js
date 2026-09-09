import { useState } from "react";
import "./App.css";

const SECTIONS = ["INF221", "INF222", "INF223", "INF224", "INF225", "INF226"];

const EMPTY_FORM = {
  name: "",
  image: "",
  section: "",
  grade: "",
};

function getEquivalent(grade) {
  const g = Number(grade);
  if (g >= 96 && g <= 100) return "4.0";
  if (g >= 90 && g <= 95) return "3.5";
  if (g >= 84 && g <= 89) return "3.0";
  if (g >= 78 && g <= 83) return "2.5";
  if (g >= 72 && g <= 77) return "2.0";
  if (g >= 66 && g <= 71) return "1.5";
  if (g >= 60 && g <= 65) return "1.0";
  return "R";
}

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (
      !form.name.trim() ||
      !form.image.trim() ||
      !form.section ||
      form.grade === ""
    ) {
      alert("All fields are required.");
      return false;
    }
    const gradeNum = Number(form.grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      alert("Grade must be a number between 0 and 100.");
      return false;
    }
    return true;
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleCreate() {
    if (!validateForm()) return;

    const newStudent = {
      id: Date.now(),
      name: form.name,
      image: form.image,
      section: form.section,
      grade: form.grade,
      equivalent: getEquivalent(form.grade),
    };

    setStudents((prev) => [...prev, newStudent]);
    handleClear();
  }

  function handleUpdate() {
    if (!validateForm()) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: form.name,
              image: form.image,
              section: form.section,
              grade: form.grade,
              equivalent: getEquivalent(form.grade),
            }
          : s
      )
    );
    handleClear();
  }

  function handleEdit(student) {
    setForm({
      name: student.name,
      image: student.image,
      section: student.section,
      grade: student.grade,
    });
    setEditingId(student.id);
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) handleClear();
  }

  return (
    <div className="page">
      <div className="card-container">
        <h1 className="title">Student Grade</h1>

        <div className="form-grid">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Image:
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
            />
          </label>

          <label>
            Section:
            <select name="section" value={form.section} onChange={handleChange}>
              <option value="">Select Section</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </label>

          <label>
            Grade:
            <input
              type="number"
              name="grade"
              min="0"
              max="100"
              value={form.grade}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="button-row">
          {editingId ? (
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>

        <div className="student-list">
          {students.length === 0 ? (
            <p className="empty-text">No student records yet.</p>
          ) : (
            students.map((student) => (
              <div className="student-card" key={student.id}>
                <div className="student-image-wrap">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt="This is an image"
                      className="student-image"
                    />
                  ) : (
                    <div className="student-image placeholder">
                      No Image
                    </div>
                  )}
                </div>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Section:</strong> {student.section}</p>
                <p><strong>Grade:</strong> {student.grade}</p>
                <p><strong>Equivalent:</strong> {student.equivalent}</p>
                <div className="card-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;