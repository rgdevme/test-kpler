---
title: Senior Full-Stack Software Engineer Challenge
---

# Senior Full-Stack Software Engineer Challenge: Internal Access Provisioning & Audit Portal

## Background

Our Identity and Access Management team is building a new internal administration tool. This tool allows operations staff to manage user access levels across our ecosystem and provides an audit log of who changed what access, and when. Your task is to build a minimal prototype of this **Access Provisioning & Audit Portal** using **TypeScript, Node.js, a SQL database, Vue.js, and Docker**.

## Time Limit

Please spend no more than 6 hours on this challenge. We respect your time and value a focused, high-quality slice of architecture over a sprawling, incomplete feature set

## Functional Specification

### 1. Database Schema

Design and implement a SQL schema that supports:

- **Users**: System users who have roles assigned to them
- **Roles**: Distinct access levels (e.g., `Admin`, `Support`, `Viewer`)
- **Audit Logs**: A history of all access modifications

### 2. Backend API (Node.js & TypeScript)

Build a robust API exposing the following endpoints:

- Retrieve a list of users alongside their current assigned roles
- Add a new user
- Update a user’s assigned roles
- Retrieve the chronological history of access change

### 3. Frontend Dashboard (Vue.js & TypeScript)

Build a single-page dashboard using Vue 3 that features:

- **User Management View**: A list or table displaying all users and their current roles, with an intuitive UI mechanism to add or remove roles from a selected user
- **Audit Log View**: A table or feed showing the history of system changes

### 4. Setup & Deployment (Docker)

Provide a `docker-compose.yml` file so that reviewers can spin up the entire local environment (including the SQL database and any seeding required) with a single command: docker-compose up

## Deliverables

1. A link to a public/private GitHub repository (share this with “cpinkerton-kpler” and “manolisan”) or a compressed zip file of the source code
2. A brief `README.md` containing:
  - Instructions on how to run the application via Docker
  - How to run the test suite
  - A short paragraph explaining any intentional architectural trade-offs you made due to the time constraint