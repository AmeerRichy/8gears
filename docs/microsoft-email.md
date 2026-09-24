# Microsoft Graph email

All three mail senders use `app/lib/email/microsoftGraph.ts`, a server-only
helper. Existing HTML templates, customer/admin recipients, payment handling,
and order/database logic are preserved. Nodemailer is no longer used by mail
sending code; its installed packages are left untouched.

Set MS_TENANT_ID, MS_CLIENT_ID, and MS_CLIENT_SECRET in .env.local for local use
and in the server environment for deployment. Never use NEXT_PUBLIC_ for these
values. Restart after changing credentials. Do not commit secrets.
ADMIN_EMAIL controls order notifications and defaults to ma@8-gear.com.
SMTP_USER is retained only as the support address in the existing order template.
SMTP_FROM, SMTP_PASS, SMTP_HOST, SMTP_PORT, and SMTP_SECURE are unused.

The helper requests a token from the tenant's v2 OAuth endpoint using
client_credentials and https://graph.microsoft.com/.default. It sends HTML via
POST https://graph.microsoft.com/v1.0/users/ma@8-gear.com/sendMail and saves sent
messages to Sent Items. The sender is fixed to ma@8-gear.com.

The application needs Microsoft Graph Mail.Send application permission with
administrator consent and access to the sending mailbox under any applicable
tenant application access policies. SMTP AUTH and SMTP.SendAsApp are not used.
Security Defaults and tenant policies are not changed by this application.

Tokens are cached in server memory and refreshed two minutes before expiry.
Concurrent sends share a token request; separate processes have separate caches.
HTTP 401 invalidates the cached token for a later send. Errors omit raw provider
responses, access tokens, and secrets. There are no automatic send retries:
a timeout may occur after acceptance, so retrying could duplicate messages.

Graph returns 202 Accepted without a response body. This confirms acceptance
for processing, not delivery to the inbox. Existing order email timestamps
continue to record successful submission.

Microsoft reference:
https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0
