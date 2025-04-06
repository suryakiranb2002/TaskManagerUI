import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Container,
  Button
} from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import TaskList from './TaskList';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/v1/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      });
      const tasks = response.data;
      setAllTasks(tasks);

      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;
      const pending = tasks.filter(task => !task.completed).length;
      const missed = tasks.filter(task =>
        !task.completed && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day')
      ).length;

      setSummary({ total, completed, pending, missed });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8082/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      });
      setFirstName(response.data.name);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8082/api/v1/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      localStorage.removeItem("jwtToken");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchDashboard();
  }, []);

  const pieData = summary ? [
    { name: 'Completed', value: summary.completed },
    { name: 'Pending', value: summary.pending - summary.missed },
    { name: 'Missed', value: summary.missed }
  ] : [];

  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  const getPercentage = (count) => {
    if (!summary?.total) return '0';
    return ((count / summary.total) * 100).toFixed(0);
  };

  

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          {firstName && <h5 className="text-secondary">👋 Welcome back, {firstName}!</h5>}
          <h2 className="fw-bold">📊 Task Manager Dashboard</h2>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Error or Loading */}
      {error && <Alert variant="danger">{error}</Alert>}
      {!summary && !error && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading dashboard...</p>
        </div>
      )}

      {/* Stats Section */}
      {summary && (
        <>
          <Row className="text-center mb-5 g-4">
            <Col md={3}>
              <Card className="shadow-sm border-info">
                <Card.Body>
                  <h6 className="text-info">Total Tasks</h6>
                  <h2>{summary.total}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-success">
                <Card.Body>
                  <h6 className="text-success">Completed</h6>
                  <h2>{summary.completed}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-warning">
                <Card.Body>
                  <h6 className="text-warning">Pending</h6>
                  <h2>{summary.pending - summary.missed}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-danger">
                <Card.Body>
                  <h6 className="text-danger">Missed</h6>
                  <h2>{summary.missed}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Pie Chart */}
          <Row className="mb-5">
            <Col md={6} className="mx-auto">
              <Card className="shadow-sm p-3">
                <h5 className="text-center mb-3">Task Distribution</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex justify-content-around mt-3 text-center">
                  <div style={{ color: COLORS[0] }}>
                    ✔ {summary.completed} ({getPercentage(summary.completed)}%)
                  </div>
                  <div style={{ color: COLORS[1] }}>
                    🕒 {summary.pending - summary.missed} ({getPercentage(summary.pending - summary.missed)}%)
                  </div>
                  <div style={{ color: COLORS[2] }}>
                    ❌ {summary.missed} ({getPercentage(summary.missed)}%)
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Task List */}
          <TaskList allTasks={allTasks} />
        </>
      )}
    </Container>
  );
};

export default Home;
