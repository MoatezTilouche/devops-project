terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine" # For Windows Docker Desktop
}

#############################
# Create a Docker Network
#############################
resource "docker_network" "my_network" {
  name = "my_network"
}

#############################
# MongoDB Container
#############################
resource "docker_container" "mongo" {
  name  = "mongo"
  image = "mongo:latest"

  ports {
    internal = 27017
    external = 27017
  }

  volumes {
    container_path = "/data/db"
    host_path      = abspath("${path.module}/mongo-data")
  }

  networks_advanced {
    name = docker_network.my_network.name
  }
}

#############################
# Backend (Flask) Image and Container
#############################
resource "docker_image" "backend" {
  name = "myapp-backend"
  build {
    path = "${path.module}/backend"
  }
}

resource "docker_container" "backend" {
  name  = "backend"
  image = docker_image.backend.name

  ports {
    internal = 5000
    external = 5000
  }

  env = [
    "FLASK_SECRET_KEY=fefd68e7f303698d367d513cad711e23f5460a8c26b06d74802201614b6b7e9b",
    "MONGO_URI=mongodb://mongo:27017/"
  ]

  depends_on = [
    docker_container.mongo
  ]

  networks_advanced {
    name = docker_network.my_network.name
  }
}

#############################
# Frontend (React) Image and Container
#############################
resource "docker_image" "frontend" {
  name = "myapp-frontend"
  build {
    path = "${path.module}/frontend"
  }
}

resource "docker_container" "frontend" {
  name  = "frontend"
  image = docker_image.frontend.name

  ports {
    internal = 80
    external = 3000
  }

  depends_on = [
    docker_container.backend
  ]

  networks_advanced {
    name = docker_network.my_network.name
  }
}
