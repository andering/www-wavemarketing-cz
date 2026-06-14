# Project configuration for /app/gcp-cloudflare-template.

project_name       = "www-wavemarketing-cz"
gcp_project_id     = "wavemarketingcz"
gcp_project_number = "531069358769"
github_repository  = "andering/www-wavemarketing-cz"
github_deploy_ref  = "refs/heads/main"
billing_account_id = "0196A9-1BD861-ED5D3F"
region             = "europe-west1"
prod_domain        = "www.wavemarketing.cz"

github_workflows = [
  "pages-deploy",
]

# Static-site deployment only. GCP bootstrap is still needed for project setup and Terraform state.
gcp_project_bootstrap_enabled = true
github_wif_enabled            = false
artifact_registry_enabled     = false
secret_manager_enabled        = false
storage_buckets_enabled       = false
monitoring_enabled            = false

database_enabled             = false
cloud_run_service_enabled    = false
cloud_run_jobs_enabled       = false
cloud_scheduler_jobs_enabled = false

# Cloudflare Pages baseline.
cloudflare_enabled                           = true
cloudflare_zone                              = "wavemarketing.cz"
cloudflare_account_id                        = "af538b9fd944b82002ae5c4e05ed4714"
cloudflare_pages_enabled                     = true
cloudflare_pages_production_branch           = "main"
cloudflare_pages_preview_deployments_enabled = false
cloudflare_pages_prod_access_enabled         = true
cloudflare_pages_prod_access_allowed_emails = [
  "andering@gmail.com",
  "honza.pisarik@autentickamedia.cz",
  "jana.skalnikova@wavemarketing.cz",
]
cloudflare_pages_build_command              = "npm ci && npm run build"
cloudflare_pages_build_output_directory     = "dist"
cloudflare_pages_root_directory             = null
cloudflare_pages_redirect_pages_dev_enabled = true
cloudflare_pages_redirect_ruleset_enabled   = false

# Keep optional Cloudflare controls off until a reviewed plan explicitly enables them.
cloudflare_security_enabled     = false
cloudflare_health_check_enabled = false

# Unused runtime values kept explicit for template validation/default clarity.
storage_buckets = {}
secrets         = {}
