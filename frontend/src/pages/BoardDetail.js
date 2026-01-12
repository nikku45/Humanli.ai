import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI, todoAPI } from '../services/api';

/**
 * Board Detail Page
 * Displays todos for a specific board
 */
const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [board, setBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');
  const [creating, setCreating] = useState(false);

  /**
   * Fetch board and todos
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [boardResponse, todosResponse] = await Promise.all([
        boardAPI.getBoard(boardId),
        todoAPI.getTodos(boardId),
      ]);

      if (boardResponse.success) {
        setBoard(boardResponse.data);
      }
      if (todosResponse.success) {
        setTodos(todosResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 404) {
        setError('Board not found');
      } else {
        setError('Failed to load board data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [boardId]);

  /**
   * Handle create todo
   */
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      setError('Todo title is required');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const response = await todoAPI.createTodo(boardId, {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        priority: newTodoPriority,
      });

      if (response.success) {
        setNewTodoTitle('');
        setNewTodoDescription('');
        setNewTodoPriority('medium');
        setShowCreateForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      setError(error.response?.data?.message || 'Failed to create todo');
    } finally {
      setCreating(false);
    }
  };

  /**
   * Handle toggle todo completion
   */
  const handleToggleTodo = async (todoId, currentStatus) => {
    try {
      await todoAPI.updateTodo(todoId, { completed: !currentStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  /**
   * Handle delete todo
   */
  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoAPI.deleteTodo(todoId);
      fetchData();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  if (loading) {
    return <div className="loading">Loading board...</div>;
  }

  if (error && !board) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '10px' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ marginBottom: '5px' }}>{board?.title || 'Board'}</h1>
          {board?.description && <p style={{ color: '#6b7280' }}>{board.description}</p>}
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>
            {completedCount} of {totalCount} todos completed
          </p>
        </div>
        <button className="btn btn-secondary" onClick={signOut}>
          Sign Out
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Create Todo Form */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Create New Todo</h2>
          <form onSubmit={handleCreateTodo}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Todo Title *
              </label>
              <input
                type="text"
                className="input"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="Enter todo title"
                required
                maxLength={200}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description (Optional)
              </label>
              <textarea
                className="textarea"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                placeholder="Enter todo description"
                maxLength={1000}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Priority
              </label>
              <select
                className="input"
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Todo'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Todos List */}
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ New Todo'}
        </button>
      </div>

      {todos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '20px' }}>
            No todos yet. Create your first todo to get started!
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            Create Todo
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {todos.map((todo) => {
            const priorityColors = {
              low: '#10b981',
              medium: '#f59e0b',
              high: '#ef4444',
            };

            return (
              <div
                key={todo._id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  opacity: todo.completed ? 0.7 : 1,
                  borderLeft: `4px solid ${priorityColors[todo.priority] || '#6b7280'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo._id, todo.completed)}
                  style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: '5px',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#9ca3af' : '#333',
                    }}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      style={{
                        margin: 0,
                        marginBottom: '10px',
                        color: '#6b7280',
                        fontSize: '14px',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    >
                      {todo.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: `${priorityColors[todo.priority] || '#6b7280'}20`,
                        color: priorityColors[todo.priority] || '#6b7280',
                      }}
                    >
                      {todo.priority.toUpperCase()}
                    </span>
                    {todo.dueDate && (
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                      Created {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
