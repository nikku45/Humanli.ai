import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI } from '../services/api';

/**
 * Dashboard Page
 * Displays all boards and allows creating new ones
 */
const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  /**
   * Fetch all boards
   */
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getBoards();
      if (response.success) {
        setBoards(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to load boards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  /**
   * Handle create board
   */
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) {
      setError('Board title is required');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const response = await boardAPI.createBoard({
        title: newBoardTitle.trim(),
        description: newBoardDescription.trim(),
      });

      if (response.success) {
        setNewBoardTitle('');
        setNewBoardDescription('');
        setShowCreateForm(false);
        fetchBoards();
      }
    } catch (error) {
      console.error('Error creating board:', error);
      setError(error.response?.data?.message || 'Failed to create board');
    } finally {
      setCreating(false);
    }
  };

  /**
   * Handle delete board
   */
  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this board? All todos in this board will also be deleted.')) {
      return;
    }

    try {
      await boardAPI.deleteBoard(boardId);
      fetchBoards();
    } catch (error) {
      console.error('Error deleting board:', error);
      setError('Failed to delete board');
    }
  };

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ marginBottom: '5px' }}>My Boards</h1>
          <p style={{ color: '#6b7280' }}>Welcome, {user?.name || user?.email}</p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={signOut} style={{ marginRight: '10px' }}>
            Sign Out
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : '+ New Board'}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Create Board Form */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Create New Board</h2>
          <form onSubmit={handleCreateBoard}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Board Title *
              </label>
              <input
                type="text"
                className="input"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Enter board title"
                required
                maxLength={100}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description (Optional)
              </label>
              <textarea
                className="textarea"
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                placeholder="Enter board description"
                maxLength={500}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Board'}
            </button>
          </form>
        </div>
      )}

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '20px' }}>
            No boards yet. Create your first board to get started!
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            Create Board
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {boards.map((board) => (
            <div
              key={board._id}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderLeft: `4px solid ${board.color || '#3b82f6'}`,
              }}
              onClick={() => navigate(`/board/${board._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, flex: 1 }}>{board.title}</h3>
                <button
                  className="btn btn-danger"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                  onClick={(e) => handleDeleteBoard(board._id, e)}
                >
                  Delete
                </button>
              </div>
              {board.description && (
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>
                  {board.description}
                </p>
              )}
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                Created {new Date(board.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
