import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { CheckCircle, Calendar, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import "../Styles/TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    dueDate: '',
    search: '',
  });

  const categories = [
    'Work', 'Personal', 'Health', 'Home', 'Finance',
    'Errands', 'Learning', 'Social', 'Miscellaneous'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle size={18} color="green" className="me-1" />;
    if (status === 'Missed') return <XCircle size={18} color="red" className="me-1" />;
    return <Calendar size={18} color="orange" className="me-1" />;
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/v1/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
      });

      const enhancedTasks = response.data.map(task => {
        const isMissed =
          !task.completed && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day');
        return {
          ...task,
          status: task.completed ? 'Completed' : isMissed ? 'Missed' : 'Pending',
        };
      });

      setTasks(enhancedTasks);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTasks = async () => {
    try {
      setLoading(true);
      let taskUrl = 'http://localhost:8082/api/v1/tasks';

      if (filters.category) {
        taskUrl = `http://localhost:8082/api/v1/tasks/category/${filters.category}`;
      }

      let response = await axios.get(taskUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
      });

      let filtered = response.data.map(task => {
        const isMissed =
          !task.completed && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day');
        return {
          ...task,
          status: task.completed ? 'Completed' : isMissed ? 'Missed' : 'Pending',
        };
      });

      if (filters.search) {
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }

      if (filters.priority) {
        filtered = filtered.filter(t => t.priority === filters.priority);
      }

      if (filters.dueDate) {
        filtered = filtered.filter(t =>
          t.dueDate && dayjs(t.dueDate).isBefore(dayjs(filters.dueDate), 'day')
        );
      }

      setTasks(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch filtered tasks');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:8082/api/v1/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
      });
      fetchFilteredTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const markAsComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = { ...task, completed: true };

      await axios.put(`http://localhost:8082/api/v1/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
      });

      fetchFilteredTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to mark task as complete');
    }
  };

  useEffect(() => {
    const isAnyFilterApplied = Object.values(filters).some(val => val);
    if (isAnyFilterApplied) {
      fetchFilteredTasks();
    } else {
      fetchTasks();
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <div className="tasklist-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="tasklist-header">Your Tasks</h2>
          <Link to="/tasks/add" className="btn btn-primary add-task-button">
            Add Task
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
          <InputGroup>
            <Form.Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
            {filters.category && (
              <Button variant="outline-secondary" onClick={() => handleFilterChange('category', '')}>❌</Button>
            )}
          </InputGroup>

          <InputGroup>
            <Form.Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </Form.Select>
            {filters.priority && (
              <Button variant="outline-secondary" onClick={() => handleFilterChange('priority', '')}>❌</Button>
            )}
          </InputGroup>

          <InputGroup>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Missed">Missed</option>
            </Form.Select>
            {filters.status && (
              <Button variant="outline-secondary" onClick={() => handleFilterChange('status', '')}>❌</Button>
            )}
          </InputGroup>

          <InputGroup>
            <Form.Control
              type="date"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            />
            {filters.dueDate && (
              <Button variant="outline-secondary" onClick={() => handleFilterChange('dueDate', '')}>❌</Button>
            )}
          </InputGroup>

          <InputGroup style={{ minWidth: '250px' }}>
            <Form.Control
              placeholder="Search title..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <Button variant="outline-secondary" onClick={() => handleFilterChange('search', '')}>❌</Button>
            )}
          </InputGroup>

          {(filters.category || filters.priority || filters.status || filters.dueDate || filters.search) && (
            <Button
              variant="outline-danger"
              onClick={() => setFilters({
                category: '',
                priority: '',
                status: '',
                dueDate: '',
                search: '',
              })}
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-responsive shadow-sm">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{task.title}</td>
                  <td>{task.description || '—'}</td>
                  <td>{task.category || '—'}</td>
                  <td>{task.priority || '—'}</td>
                  <td className="position-relative status-cell">
                    {getStatusIcon(task.status)}{task.status}
                    {task.status === 'Pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        className="mark-complete-btn"
                        onClick={() => markAsComplete(task.id)}
                      >
                        ✅ Mark as Complete
                      </Button>
                    )}
                  </td>
                  <td>{task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/tasks/edit/${task.id}`} className="btn btn-sm btn-outline-secondary">
                        Edit
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
