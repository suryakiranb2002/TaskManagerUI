import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';

const EditTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/api/v1/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setTask(res.data);
      } catch (err) {
        setError('Failed to fetch task details');
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setTask({
      ...task,
      completed: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put(`http://localhost:8082/api/v1/tasks/${id}`, task, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Task updated successfully');
      navigate('/home');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (!task) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <Card className="shadow-sm p-4 rounded-4">
        <h3 className="mb-4">Edit Task</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={task.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={task.description} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={task.category} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={task.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="date" name="dueDate" value={task.dueDate} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Mark as Completed"
              name="completed"
              checked={task.completed}
              onChange={handleCheckboxChange}
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Update Task
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditTask;
