# WorkAgenda <!-- omit in toc -->

- [About](#about)
- [Usage](#usage)
- [Requirements](#requirements)
- [Installation](#installation)
- [Start the app](#start-the-app)

## About

This project aims to practice the React framework, implementing user authentication, and doing full stack development. Front end development starts with the theme provided by [Creative Tim](https://www.creative-tim.com/live/material-dashboard-react-nodejs), and further development uses [Material-UI](https://material-ui.com/). Back end development uses [Node.js](https://expressjs.com/) as the server and [SQLite](https://sqlite.org/index.html) as the database.

## Usage

The app allows you to manage projects and related project such as bugs and working schedule.

## Requirements
- [Node.js](https://expressjs.com/)
- [SQLite3](https://sqlite.org/download.html)

## Installation

```sh
# install server-side dependencies
npm install

# install client-side dependencies
npm run client-install

# go to the app directory
cd WorkAgenda

# create database file
touch database.db

# create schemas in the database
sqlite3 database.db
.read reset_tables.sql

# exit sqlite3 database
.exit
```

## Start the app

```sh
npm run dev
```