# The order API (create-order, payment intent, Stripe webhook — tasks 5 to 7)
# as a single Scaleway function. All logic lives in picaron_web_2/lib/server;
# functions/api/handler.ts only adapts the Scaleway HTTP event to it.
# Build the bundle first: `npm run build:functions` (from picaron_web_2).

locals {
  # APP_ENV as understood by lib/server/config.ts.
  app_env = var.environment == "prod" ? "production" : "staging"

  # Empty optional secrets (e.g. SMTP without auth) are left out.
  api_secrets = {
    for key, value in {
      DATABASE_URL          = var.database_url
      STRIPE_SECRET_KEY     = var.stripe_secret_key
      STRIPE_WEBHOOK_SECRET = var.stripe_webhook_secret
      EMAILJS_PRIVATE_KEY   = var.emailjs_private_key
      SMTP_USER             = var.smtp_user
      SMTP_PASS             = var.smtp_pass
    } : key => value if value != ""
  }

  # Same for the plain variables that depend on the email transport (EmailJS
  # ids when using smtp, SMTP host when using the temporary emailjs transport).
  api_env = {
    for key, value in {
      APP_ENV             = local.app_env
      PAYMENT_PROVIDER    = "stripe"
      EMAIL_TRANSPORT     = var.email_transport # FIXME(email): "emailjs" is temporary (variables.tf)
      TEAM_NOTIFY_EMAIL   = var.team_notify_email
      SHIPPING_METHODS    = join(",", var.shipping_methods)
      EMAILJS_SERVICE_ID  = var.emailjs_service_id
      EMAILJS_TEMPLATE_ID = var.emailjs_template_id
      EMAILJS_PUBLIC_KEY  = var.emailjs_public_key
      SMTP_HOST           = var.smtp_host
      SMTP_PORT           = tostring(var.smtp_port)
      SMTP_SECURE         = tostring(var.smtp_secure)
      EMAIL_FROM          = var.email_from
      SITE_URL            = var.site_url
      ALLOWED_ORIGINS     = join(",", var.allowed_origins)
      # Serverless: each instance keeps few connections to the SQL database.
      DATABASE_POOL_MAX = "2"
    } : key => value if value != ""
  }
}

resource "scaleway_function_namespace" "backend" {
  name        = "picaron-backend-${var.environment}"
  description = "Picaron checkout backend (${var.environment})"

  lifecycle {
    # Guard against applying prod values onto the staging state (or the
    # reverse): the workspace and the tfvars file must agree.
    precondition {
      condition     = terraform.workspace == var.environment
      error_message = "Workspace \"${terraform.workspace}\" does not match environment \"${var.environment}\". Run: terraform workspace select ${var.environment}"
    }
  }
}

data "archive_file" "api" {
  type        = "zip"
  source_file = "${path.module}/../../functions/dist/api/handler.js"
  output_path = "${path.module}/.build/api-${var.environment}.zip"
}

resource "scaleway_function" "api" {
  namespace_id = scaleway_function_namespace.backend.id
  name         = "api"
  runtime      = "node24"
  handler      = "handler.handle"
  privacy      = "public"
  http_option  = "redirected"
  zip_file     = data.archive_file.api.output_path
  zip_hash     = data.archive_file.api.output_sha256
  deploy       = true
  min_scale    = 0
  max_scale    = 5
  memory_limit = 256
  timeout      = 30

  environment_variables = local.api_env

  secret_environment_variables = local.api_secrets
}
