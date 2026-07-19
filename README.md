# Gainstack

Gainstack is a full-stack fitness tracking and social networking platform that enables users to monitor their fitness journey, share progress with others, and engage with a community through social features. The application combines workout tracking, user profiles, media sharing, and secure authentication into a modern, scalable web application.

The project was developed over a two-week internship at **Zetta**, where a team of interns collaborated to design, implement, and deliver a production-style application within an agile development environment.

---

## Overview

Gainstack was built to simulate a real-world software product, emphasizing clean architecture, secure authentication, scalable backend services, and an intuitive user experience.

The application demonstrates modern full-stack development practices using React, Spring Boot, PostgreSQL, Docker, and object storage through MinIO.

---

## Features

- User registration and login
- JWT-based authentication and authorization
- User profiles
- Fitness activity tracking
- Social feed
- Create and interact with posts
- Image upload and storage using MinIO
- Responsive user interface
- Secure REST API
- Persistent PostgreSQL database
- Containerized development environment with Docker

---

## Technology Stack

### Frontend

- React
- Tailwind CSS
- React Router
- Axios

### Backend

- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- REST API

### Database

- PostgreSQL

### Storage

- MinIO Object Storage

### DevOps

- Docker
- Docker Compose

---

## Architecture

```
                React + Tailwind
                       │
                REST API (JWT)
                       │
              Spring Boot Backend
             ┌──────────┴──────────┐
             │                     │
        PostgreSQL             MinIO
        Application          Image Storage
          Database
```

---

## Project Structure

```
Gainstack/
│
├── frontend/          # React application
├── backend/           # Spring Boot API
├── docker/            # Docker configuration
├── docker-compose.yml
└── README.md
```

---

## Authentication

Gainstack uses **JSON Web Tokens (JWT)** for secure authentication.

Authentication flow:

1. User signs in with their credentials.
2. Spring Security validates the request.
3. A JWT access token is generated.
4. The frontend stores the token.
5. Protected API endpoints require a valid JWT in the Authorization header.

This approach enables stateless authentication while maintaining a secure and scalable backend architecture.

---

## File Storage

User-uploaded images are stored using **MinIO**, an S3-compatible object storage solution.

Benefits include:

- Scalable media storage
- Separation of application and file storage
- Efficient handling of user-uploaded content
- Simple integration with Spring Boot

---

## Database

Application data is stored in PostgreSQL.

The database manages:

- Users
- Authentication data
- Fitness records
- Posts
- Media references
- Social interactions

---

## Running the Project

### Prerequisites

- Docker
- Docker Compose
- Git

Clone the repository:

```bash
git clone https://github.com/Mysty47/Gainstack.git

cd Gainstack
```

Start the application:

```bash
docker compose up --build
```

Once all services are running, the application will be available locally.

---

## Development

The project follows a client-server architecture.

**Frontend**

- React
- Tailwind CSS
- API communication through Axios

**Backend**

- Spring Boot
- Spring Security
- JPA/Hibernate
- PostgreSQL
- MinIO integration

---

## Learning Outcomes

Developing Gainstack provided practical experience with:

- Full-stack application architecture
- Secure authentication using JWT
- RESTful API development
- Database modeling with PostgreSQL
- Object storage integration using MinIO
- Containerized application deployment with Docker
- Collaborative software development using Git
- Agile development within a fixed delivery timeline

---

## Future Improvements

Potential enhancements include:

- Workout plans and scheduling
- Real-time notifications
- Friend requests and messaging
- Activity likes and comments
- Search functionality
- Push notifications
- Analytics dashboard
- Mobile application
- CI/CD pipeline
- Automated testing

---

## Acknowledgements

Gainstack was developed during a **two-week software engineering internship at Zetta**.

The project was built collaboratively by the internship team under the guidance of experienced software engineers and mentors, providing hands-on experience with modern development practices and full-stack technologies.

---

## License

This project is intended for educational and portfolio purposes.
