terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

resource "docker_image" "myapp" {
  name = "myapp"
  build {
    context = "${path.module}/backend"
  }
}

resource "docker_container" "myapp" {
  name  = "myapp"
  image = docker_image.myapp.latest

  ports {
    internal = 5000
    external = 5000
  }
}
