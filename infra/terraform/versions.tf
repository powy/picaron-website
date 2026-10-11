terraform {
  required_version = ">= 1.5"

  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.45"
    }
    # Zips the bundled function (functions/dist/api/handler.js) at plan time.
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}
