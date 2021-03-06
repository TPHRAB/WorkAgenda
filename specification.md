# Endpoints

## Login

- **Endpoint**: `/login`
- **Request**: POST
- **Params**
  - `username`
  - `password`

## Logout

- **Endpoint**: `/logout`
- **Request**: GET

## Dashboard

- **Endpoint**: `/dashboard/:section`
- **Request**: GET
- **Params**
  - `section`: the content to see when visiting the dashboard, it can be one of the following options
    - `setting`
    - `colleagues`
    - `agenda`


# Database

## Tables
- users
  - username (primary key)
  - password (hash)
  - salt
  - usericon
- messages
  - id (foreign key from user)
  - receiver_id (foreign key from users)
  - message
  - send time
- settings
  - id (foeign key from user)
- sessions
  - managed by session store
- projects
  - project-id
  - project name 
  - PRIMARY KEY (username, project-id)
  - description


---
# Learnings
- Session has to be set before `res.send()` becasue `res.send()` triggers `Sqlite3Store.set()`

---
# Issue

- Tweak components/Table/Table.js to fit BugReport