# devops-project
# 🛠 DevOps Project – Community Web App

## 📌 Description
A full-stack community platform built with **React**, **Flask**, and **MongoDB**, enabling users to:
- Publish posts (author, subject, description)
- Add replies to posts
- Like and rate team members
- Use a pop-up modal to submit feedback

The project is containerized with **Docker** and deployable with **Terraform**, with **CI/CD pipelines** managed via **GitHub Actions**.

---

## 📂 Project Structure
```
devops-project/
├── backend/             # Flask backend API
│   ├── back.py
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/pages/
│   └── public/
├── mongo-data/          # MongoDB volume
├── docker-compose.yml   # Compose file for local services
├── main.tf              # Terraform config
├── .github/workflows/   # CI/CD workflows
│   ├── ci.yml
│   └── cd.yml
└── README.md            # Project overview
```

---

## 🚀 Features
### 🔹 Post Creation
- Form to submit `author`, `subject`, and `description`
- Posts displayed in a feed with likes and replies

### 🔹 Replies
- Toggleable reply box per post
- Responses are timestamped and stored in MongoDB

### 🔹 Likes and Ratings
- Like button per post
- Rating popup for team members (stars + optional message)

### 🔹 Backend API (Flask)
| Endpoint                         | Method | Description                             | Request Body Fields                            |
|----------------------------------|--------|-----------------------------------------|------------------------------------------------|
| `/api/contact`                  | POST   | Submit a contact message                | `name`, `email`, `subject (optional)`, `message`|
| `/api/rate`                     | POST   | Rate a team member                      | `member_name`, `rating`, `message`             |
| `/api/post`                     | GET    | Fetch all community posts               | –                                              |
| `/api/post`                     | POST   | Create a new community post             | `auteur`, `subject`, `description`             |
| `/api/post/<post_id>`          | GET    | Get a specific post by ID               | –                                              |
| `/api/post/<post_id>/response` | POST   | Add a reply to a post                   | `author`, `message`                            |
| `/api/post/<post_id>`          | DELETE | Delete a specific post                  | –                                              |


### 🔹 Frontend (React)
- Pages: `TeamPage.js`, `ContactPage.js`, `CommunityPage.js`
- Responsive layout
- Uses `react-icons` for UI

---

## 🐳 Docker
### Build & Run Backend:
```bash
cd backend
docker build -t myapp-backend .
docker run -p 5000:5000 myapp-backend
```

### Docker Compose (Frontend + Backend + MongoDB)
```bash
docker-compose up --build -d
```

---

## ⚙️ Terraform
Used to deploy and manage Docker containers.
```bash
terraform init
terraform apply
```

### Terraform Resources
- `docker_image` for each service
- `docker_container` for frontend, backend, and MongoDB
- `volume` for MongoDB data

---

## 🔁 CI/CD with GitHub Actions
### `.github/workflows/ci.yml`
- Build and validate Docker images on push

### `.github/workflows/cd.yml`
- Stop running containers
- Build & redeploy new containers on `main` branch push

---

## 📸 Screenshots
-There are screenshots of the application in a folder named "screenshots" 

---





## 👨‍💻 Author
- **Nom et prénom** : Moatez Tilouche , Med Akram Nsir, Oussama Laajilli, Achraf Laajimi
- **Encadrants** : Mr Lazhar Hamel et Madame Dorra Dhaou 
- **Année** : 2024–2025

---


