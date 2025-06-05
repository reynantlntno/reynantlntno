const mysql = require('mysql2/promise')
require('dotenv').config()

// Create connection pool for efficient database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  multipleStatements: false,
  ssl: {
    rejectUnauthorized: false
  }
})

// Database utility functions
const db = {
  // Execute a query with parameters
  async query(sql, params = []) {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  },

  // Get a single row
  async queryOne(sql, params = []) {
    const rows = await this.query(sql, params)
    return rows.length > 0 ? rows[0] : null
  },

  // Insert a record and return the inserted ID
  async insert(table, data) {
    const fields = Object.keys(data)
    const values = Object.values(data)
    const placeholders = fields.map(() => '?').join(',')
    
    const sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`
    
    try {
      const [result] = await pool.execute(sql, values)
      return result.insertId
    } catch (error) {
      console.error('Database insert error:', error)
      throw error
    }
  },

  // Update a record
  async update(table, data, where, whereParams = []) {
    const fields = Object.keys(data)
    const values = Object.values(data)
    const setClause = fields.map(field => `${field} = ?`).join(',')
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`
    const params = [...values, ...whereParams]
    
    try {
      const [result] = await pool.execute(sql, params)
      return result.affectedRows
    } catch (error) {
      console.error('Database update error:', error)
      throw error
    }
  },

  // Delete a record
  async delete(table, where, whereParams = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`
    
    try {
      const [result] = await pool.execute(sql, whereParams)
      return result.affectedRows
    } catch (error) {
      console.error('Database delete error:', error)
      throw error
    }
  },

  // Get paginated results
  async paginate(baseQuery, countQuery, params, page = 1, limit = 10) {
    const offset = (page - 1) * limit
    
    // Get total count
    const [{ total }] = await this.query(countQuery, params)
    
    // Get paginated results
    const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`
    const rows = await this.query(paginatedQuery, [...params, limit, offset])
    
    const totalPages = Math.ceil(total / limit)
    
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  },

  // Search with pagination
  async searchWithPagination(table, searchFields, searchTerm, additionalWhere = '', additionalParams = [], page = 1, limit = 10, orderBy = 'id DESC') {
    const searchConditions = searchFields.map(field => `${field} LIKE ?`).join(' OR ')
    const searchParams = searchFields.map(() => `%${searchTerm}%`)
    
    let whereClause = searchConditions
    let queryParams = searchParams
    
    if (additionalWhere) {
      whereClause = `(${searchConditions}) AND ${additionalWhere}`
      queryParams = [...searchParams, ...additionalParams]
    }
    
    const baseQuery = `SELECT * FROM ${table} WHERE ${whereClause} ORDER BY ${orderBy}`
    const countQuery = `SELECT COUNT(*) as total FROM ${table} WHERE ${whereClause}`
    
    return await this.paginate(baseQuery, countQuery, queryParams, page, limit)
  },

  // Close pool (for cleanup)
  async close() {
    await pool.end()
  }
}

module.exports = { db, pool }