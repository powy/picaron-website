# Serverless SQL Database for the `commandes` table, one per environment.
# Wire-compatible Postgres — schema lives in picaron_web_2/scripts/db/schema.sql,
# applied with `npm run db:setup` (DATABASE_URL pointing at this instance),
# not by Terraform.
resource "scaleway_sdb_sql_database" "commandes" {
  name    = "picaron-commandes-${var.environment}"
  min_cpu = 0
  max_cpu = 8
}
