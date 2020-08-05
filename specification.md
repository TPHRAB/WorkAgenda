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
    - id (primary key)
    - username
    - password (hash)
    - salt
- messages
    - id (foreign key from user)
    - receiver_id (foreign key from users)
    - message
    - send time
- settings
    - id (foeign key from user)


---
# Tomorrow
- set up jwt token attacher