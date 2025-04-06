import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';

const AddTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    dueDate: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8082/api/v1/tasks', task, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Task created successfully!');
      navigate('/home');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const categories = [
    'Work', 'Personal', 'Health', 'Home', 'Finance', 'Errands', 'Learning', 'Social', 'Miscellaneous'
  ];

  return (
    <div className="container mt-4">
      <Card className="shadow-sm p-4 rounded-4">
        <h3 className="mb-4">Add New Task</h3>

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
            <Form.Select name="category" value={task.category} onChange={handleChange}>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </Form.Select>
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

          <Button variant="primary" type="submit">
            Create Task
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddTask;
