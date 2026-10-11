# One configuration, two environments. Each one lives in its own Terraform
# workspace (separate state) with its own tfvars file:
#   terraform workspace select staging && terraform apply -var-file=staging.tfvars
#   terraform workspace select prod    && terraform apply -var-file=prod.tfvars
# Secrets are never written in tfvars files: pass them as TF_VAR_... env vars
# (see README.md). They do end up in the Terraform state — keep it private.

variable "environment" {
  description = "staging or prod — must match the current Terraform workspace."
  type        = string

  validation {
    condition     = contains(["staging", "prod"], var.environment)
    error_message = "environment must be \"staging\" or \"prod\"."
  }
}

variable "site_url" {
  description = "Public site URL, used in emails (e.g. https://picaron.fr, or https://staging.picaron.fr for staging)."
  type        = string
}

variable "allowed_origins" {
  description = "Origins allowed to call the API from the browser (the Vercel site(s) of this environment)."
  type        = list(string)
}

variable "email_from" {
  type    = string
  default = "Picaron <commandes@picaron.fr>"
}

# FIXME(email): "emailjs" is a TEMPORARY stopgap: order emails go to the team
# through the EmailJS contact template (subject tagged FIXME), not to the
# customer. Switch to "smtp" (and fill smtp_*) once a provider is chosen. See
# shop update plan/13-plan-mise-en-production.md, "Email".
variable "email_transport" {
  description = "smtp (real customer emails) or emailjs (temporary: emails to the team only)."
  type        = string
  default     = "emailjs"

  validation {
    condition     = contains(["smtp", "emailjs"], var.email_transport)
    error_message = "email_transport must be \"smtp\" or \"emailjs\"."
  }
}

variable "team_notify_email" {
  description = "Address that receives a notification for every paid or failed order. Required with email_transport = \"smtp\"; ignored with \"emailjs\" (the EmailJS template decides the recipient)."
  type        = string
  default     = ""
}

variable "shipping_methods" {
  description = "Shipping methods the API accepts: any of mondial_relay, colissimo. Keep in sync with NEXT_PUBLIC_SHIPPING_METHODS on Vercel."
  type        = list(string)
  default     = ["mondial_relay", "colissimo"]

  validation {
    condition     = length(var.shipping_methods) > 0 && alltrue([for m in var.shipping_methods : contains(["mondial_relay", "colissimo"], m)])
    error_message = "shipping_methods must be a non-empty list of mondial_relay and/or colissimo."
  }
}

variable "emailjs_service_id" {
  description = "FIXME(email): same EmailJS service as the contact form."
  type        = string
  default     = ""
}

variable "emailjs_template_id" {
  description = "FIXME(email): same EmailJS template as the contact form (name/email/subject/message)."
  type        = string
  default     = ""
}

variable "emailjs_public_key" {
  description = "FIXME(email): EmailJS public key (not secret)."
  type        = string
  default     = ""
}

variable "smtp_host" {
  type    = string
  default = ""
}

variable "smtp_port" {
  type    = number
  default = 587
}

variable "smtp_secure" {
  description = "true for SMTPS (port 465), false for STARTTLS (587)."
  type        = bool
  default     = false
}

# --- Secrets (TF_VAR_database_url, TF_VAR_stripe_secret_key, ...) -----------

variable "database_url" {
  description = "postgres://<iam-app-id>:<api-key>@<endpoint>/<db>?sslmode=require — IAM key created by hand, see README."
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "sk_test_... for staging, sk_live_... for prod (enforced by the app, see lib/server/config.ts)."
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "whsec_... of the Stripe webhook endpoint registered for this environment."
  type        = string
  sensitive   = true
  default     = ""
}

variable "emailjs_private_key" {
  description = "FIXME(email): EmailJS account private key (Account > Security), needed to call EmailJS from a server."
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_user" {
  type      = string
  sensitive = true
  default   = ""
}

variable "smtp_pass" {
  type      = string
  sensitive = true
  default   = ""
}
