import axios from 'axios';

/**
 * API service layer
 * Handles all HTTP requests to the backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Set authorization token in headers
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Auth API
 */
export const authAPI = {
  /**
   * Register or login with Firebase token
   */
  registerOrLogin: async (firebaseToken) => {
    const response = await api.post('/auth/register', { firebaseToken });
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

/**
 * Board API
 */
export const boardAPI = {
  /**
   * Get all boards
   */
  getBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  /**
   * Get a single board
   */
  getBoard: async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  /**
   * Create a new board
   */
  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  /**
   * Update a board
   */
  updateBoard: async (boardId, boardData) => {
    const response = await api.put(`/boards/${boardId}`, boardData);
    return response.data;
  },

  /**
   * Delete a board
   */
  deleteBoard: async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  },
};

/**
 * Todo API
 */
export const todoAPI = {
  /**
   * Get all todos for a board
   */
  getTodos: async (boardId) => {
    const response = await api.get(`/todos/boards/${boardId}/todos`);
    return response.data;
  },

  /**
   * Get a single todo
   */
  getTodo: async (todoId) => {
    const response = await api.get(`/todos/${todoId}`);
    return response.data;
  },

  /**
   * Create a new todo
   */
  createTodo: async (boardId, todoData) => {
    const response = await api.post(`/todos/boards/${boardId}/todos`, todoData);
    return response.data;
  },

  /**
   * Update a todo
   */
  updateTodo: async (todoId, todoData) => {
    const response = await api.put(`/todos/${todoId}`, todoData);
    return response.data;
  },

  /**
   * Delete a todo
   */
  deleteTodo: async (todoId) => {
    const response = await api.delete(`/todos/${todoId}`);
    return response.data;
  },
};

export default api;
