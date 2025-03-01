const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.address - Address
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} - Created user object
 */
const createUser = async (userData) => {
  const { firstName, lastName, address, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await db.query(
      'CALL sp_InsertUser($1, $2, $3, $4, $5, NULL)',
      [firstName, lastName, address, email, hashedPassword]
    );
    
    // PostgreSQL stored procedure with OUT parameter doesn't return value directly
    // Let's query to get the newly created user
    const userResult = await db.query(
      'SELECT * FROM User_Info WHERE Email = $1', 
      [email]
    );
    
    return userResult.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update existing user
 * @param {number} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
const updateUser = async (userId, userData) => {
  const { firstName, lastName, address, email } = userData;
  
  try {
    await db.query(
      'CALL sp_UpdateUser($1, $2, $3, $4, $5)',
      [userId, firstName, lastName, address, email]
    );
    
    const result = await db.query('SELECT * FROM fn_GetUserByID($1)', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User object
 */
const getUserById = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetUserByID($1)', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} - Array of user objects
 */
const getAllUsers = async () => {
  try {
    const result = await db.query('SELECT * FROM fn_GetAllUsers()');
    return result.rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

/**
 * Get user audit history
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of audit records
 */
const getUserAuditHistory = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetUserAuditHistory($1)', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting user audit history:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllUsers,
  getUserAuditHistory
};