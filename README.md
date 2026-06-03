# Salesloft MCP Server

A Model Context Protocol (MCP) server that provides full access to the Salesloft REST API v2. Enables Claude and other MCP clients to manage people, accounts, cadences, activities, opportunities, and more.

## Setup

### 1. Get your Salesloft API key

Generate an API key at https://accounts.salesloft.com/oauth/applications.

> 🔑 Treat this key like a password. It belongs **only** in your local MCP config file (below). Never paste it into a chat with Claude or any other AI, and never commit it.

### 2. Add the server to your Claude client

**Recommended — run straight from GitHub, no clone, no build, no paths to maintain.** `npx` fetches this repo, builds it automatically, and runs it. This is the config block to use:

```json
{
  "mcpServers": {
    "salesloft": {
      "command": "npx",
      "args": ["-y", "github:Spread-Out/salesloft-mcp-server"],
      "env": {
        "SALESLOFT_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

(Requires Node.js 18+ on your machine — `node -v` to check.)

#### Claude Desktop (most common)

Claude Desktop has no install command — you edit a JSON config file by hand:

1. Open the config file (the app can do this for you: **Settings → Developer → Edit Config**), or open it directly:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
2. Paste the block above. If the file already has an `mcpServers` object with other servers, **merge** the `salesloft` key into it rather than replacing the whole file. If the file is empty/new, paste the block as-is.
3. Replace `your-api-key-here` with your key, save, then **fully quit and reopen** Claude Desktop (a window-close is not enough).

#### Claude Code (CLI)

One command — substitute your key, then relaunch:

```bash
claude mcp add-json salesloft -s user '{"command":"npx","args":["-y","github:Spread-Out/salesloft-mcp-server"],"env":{"SALESLOFT_API_KEY":"your-api-key-here"}}'
```

`-s user` makes it available across all your projects; omit it to scope to the current project only. Run the command in your terminal (not in a Claude chat) so your key stays out of any transcript.

### 3. Verify

After restarting, the `salesloft_*` tools (e.g. `salesloft_get_me`) are available. In Claude Code, `claude mcp list` shows `salesloft`. Ask Claude to "list my Salesloft cadences" to confirm the key works.

<details>
<summary><strong>Alternative: local clone</strong> (for contributors or offline use)</summary>

Only needed if you're modifying the server itself. The `npx` path above covers normal use.

```bash
git clone https://github.com/Spread-Out/salesloft-mcp-server.git
cd salesloft-mcp-server
npm install   # the "prepare" script runs the build automatically
```

Then point your config at the built file with an **absolute** path (`~` and relative paths will not work — run `pwd` inside the repo to get it):

```json
{
  "mcpServers": {
    "salesloft": {
      "command": "node",
      "args": ["/absolute/path/to/salesloft-mcp-server/dist/index.js"],
      "env": {
        "SALESLOFT_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

</details>

## Available Tools (~75 tools)

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
