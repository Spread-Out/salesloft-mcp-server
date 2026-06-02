# Salesloft MCP Server

A Model Context Protocol (MCP) server that provides full access to the Salesloft REST API v2. Enables Claude and other MCP clients to manage people, accounts, cadences, activities, opportunities, and more.

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/alyce-spreadai/salesloft-mcp-server salesloft-mcp-server
cd salesloft-mcp-server
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Get your Salesloft API key

Generate an API key at https://accounts.salesloft.com/oauth/applications

### 4. Configure in Claude Code or Claude Desktop

Add the following block to either client — both will pick it up and run the server automatically. No additional setup required.

> ⚠️ **You must replace `<ABSOLUTE_PATH_TO_REPO>` with the real path on your machine.** Relative paths and `~` will not work — Claude needs an absolute path. From inside the cloned repo, run `pwd` to print it, e.g. `/Users/jane/code/salesloft-mcp-server`.

```json
{
  "mcpServers": {
    "salesloft": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_REPO>/dist/index.js"],
      "env": {
        "SALESLOFT_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Where to put it:**

- **Claude Code** — 


After saving, the Salesloft tools (`salesloft_*`) will be available the next time the client launches.

## Available Tools (~60 tools)

### People
- `salesloft_list_people` - List/search/filter people
- `salesloft_get_person` - Get person by ID
- `salesloft_create_person` - Create a person
- `salesloft_update_person` - Update a person
- `salesloft_delete_person` - Delete a person
- `salesloft_upsert_person` - Upsert by email

### Accounts
- `salesloft_list_accounts` - List/search/filter accounts
- `salesloft_get_account` - Get account by ID
- `salesloft_create_account` - Create an account
- `salesloft_update_account` - Update an account
- `salesloft_delete_account` - Delete an account
- `salesloft_upsert_account` - Upsert by domain

### Cadences
- `salesloft_list_cadences` - List cadences
- `salesloft_get_cadence` - Get cadence by ID
- `salesloft_list_cadence_memberships` - List cadence memberships
- `salesloft_create_cadence_membership` - Add person to cadence
- `salesloft_delete_cadence_membership` - Remove from cadence

### Activities
- `salesloft_list_activities` - List all activities
- `salesloft_list_calls` / `salesloft_get_call` - Calls
- `salesloft_list_emails` / `salesloft_get_email` - Emails
- `salesloft_list_tasks` / `salesloft_create_task` / `salesloft_update_task` - Tasks
- `salesloft_list_notes` / `salesloft_create_note` - Notes

### Opportunities
- `salesloft_list_opportunities` / `salesloft_get_opportunity`
- `salesloft_list_opportunity_stages`

### Users & Teams
- `salesloft_get_me` - Current user
- `salesloft_list_users` / `salesloft_get_user`
- `salesloft_list_groups` / `salesloft_get_team`
- `salesloft_list_custom_roles`

### Calendar & Meetings
- `salesloft_list_calendar_events` / `salesloft_get_calendar_event`
- `salesloft_list_meetings` / `salesloft_get_meeting`

### Conversations
- `salesloft_list_conversations` / `salesloft_get_conversation`
- `salesloft_list_pending_emails` / `salesloft_update_pending_email` / `salesloft_delete_pending_email`
- `salesloft_list_live_feed_items`

### Workflows
- `salesloft_list_bulk_jobs` / `salesloft_get_bulk_job` / `salesloft_list_bulk_job_results`
- `salesloft_list_imports` / `salesloft_get_import`

### Admin
- `salesloft_list_custom_fields` / `salesloft_create_custom_field`
- `salesloft_list_tags`
- `salesloft_list_email_templates` / `salesloft_get_email_template`
- `salesloft_list_call_dispositions` / `salesloft_list_call_sentiments`
- `salesloft_list_webhooks`
- `salesloft_list_person_stages` / `salesloft_list_account_stages` / `salesloft_list_account_tiers`
- `salesloft_list_saved_list_views`
- `salesloft_list_successes`
- `salesloft_list_crm_activities` / `salesloft_list_crm_activity_fields`
- `salesloft_list_actions` / `salesloft_list_caller_ids`
- `salesloft_list_steps` / `salesloft_get_step`

## API Details

- **Base URL**: `https://api.salesloft.com/v2`
- **Auth**: Bearer token via `SALESLOFT_API_KEY` env var
- **Pagination**: All list tools support `page` and `per_page` params (1-100 per page)
- **Rate Limiting**: 600 cost/minute team-level; errors surface remaining quota
- **Sorting**: Most list tools support `sort_by` and `sort_direction`
