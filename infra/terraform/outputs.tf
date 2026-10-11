output "environment" {
  value = var.environment
}

output "database_name" {
  value = scaleway_sdb_sql_database.commandes.name
}

output "database_endpoint" {
  value = scaleway_sdb_sql_database.commandes.endpoint
}

output "function_namespace_id" {
  value = scaleway_function_namespace.backend.id
}

# -> NEXT_PUBLIC_API_BASE_URL of the matching Vercel environment.
output "api_url" {
  value = "https://${scaleway_function.api.domain_name}"
}

# -> Stripe dashboard (test mode for staging, live mode for prod) > Webhooks
#    > endpoint URL, events payment_intent.succeeded + payment_intent.payment_failed.
output "stripe_webhook_url" {
  value = "https://${scaleway_function.api.domain_name}/stripe-webhook"
}
