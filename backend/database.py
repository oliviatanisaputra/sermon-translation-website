import sqlite3


# connect: to connect or create database
db_connection = sqlite3.connect("mydatabase.db")

# cursor: to interact with database
db_cursor = db_connection.cursor()

# execute: to "send" to the database
# db_cursor.execute("CREATE TABLE IF NOT EXISTS USERS")



# === DROP TABLES IF EXISTS ===

# try:
#     db_cursor.execute(f"DROP TABLE IF EXISTS sermons")
#     print(f"Table 'users' dropped successfully, if it existed.")
# except sqlite3.Error as e:
#     print(f"An error occurred: {e}")



# === CREATE USERS TABLE ===

# SQL query to create the table
users_table = """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password CHAR(25) NOT NULL
    );
"""
db_cursor.execute(users_table)



# === CREATE SERMONS TABLE ===

sermons_table = """
    CREATE TABLE IF NOT EXISTS sermons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL UNIQUE,
        date CHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_by VARCHAR(255) NOT NULL,
        last_edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
"""
db_cursor.execute(sermons_table)


# # confirm that the table has been created
# print("Table is Ready")



# === INSERT USERS ===

new_users = [
#     ('lipp', 'hahaha'),
#     ('isong', 'huhu'),
#     ('cici', 'caca')
]
# commit: commit/submit the changes to the database
db_connection.commit()
db_cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", new_users)


# === INSERT SERMONS ===

new_sermons = [
#     ('First Sermon', '2025-01-20', '안녕하세요\nHello', 'cici', '2025-01-20 10:00:00'),
]
db_connection.commit()
db_cursor.executemany("INSERT INTO sermons (title, date, content, created_by, last_edited) VALUES (?, ?, ?, ?, ?)", new_sermons)




# verify tables
db_cursor.execute("SELECT * FROM users")
rows = db_cursor.fetchall()
print("Data in the table:")
for row in rows:
    print(row)

db_cursor.execute("SELECT * FROM users")
print("Users in database:", db_cursor.fetchall())

db_cursor.execute("SELECT * FROM sermons")
print("Sermons in database:", db_cursor.fetchall())



# close the connection to the database
db_connection.close()