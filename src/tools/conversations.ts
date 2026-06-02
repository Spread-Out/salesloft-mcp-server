import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as client from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "salesloft_list_conversations",
    "List conversations (Salesloft Conversations / Drift)",
    {
      page: z.number().optional().describe("Page number"),
      per_page: z.number().min(1).max(100).optional().describe("Records per page"),
      sort_by: z.string().optional().describe("Field to sort by"),
      sort_direction: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
      user_guid: z.string().optional().describe("User UUID to filter by (defaults to authenticated user)"),
    },
    async ({ user_guid, ...rest }) => {
      let guid = user_guid;
      if (!guid) {
        const me = await client.get<{ data: { guid: string } }>("/me.json");
        guid = me.data.guid;
      }
      const result = await client.get("/conversations/calls.json", { ...rest, user_guid: guid });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_conversation",
    "Get a single conversation call by numeric ID or UUID (from recording URL)",
    { id: z.union([z.number(), z.string()]).describe("Conversation call ID or UUID") },
    async ({ id }) => {
      const result = await client.get(`/conversations/calls/${id}.json`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Live Feed Items
  server.tool(
    "salesloft_list_live_feed_items",
    "List live feed items (real-time activity feed)",
    {
      page: z.number().optional().describe("Page number"),
      per_page: z.number().min(1).max(100).optional().describe("Records per page"),
    },
    async (params) => {
      const result = await client.get("/live_feed_items.json", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Pending Emails
  server.tool(
    "salesloft_list_pending_emails",
    "List pending emails (scheduled/queued but not yet sent)",
    {
      page: z.number().optional().describe("Page number"),
      per_page: z.number().min(1).max(100).optional().describe("Records per page"),
    },
    async (params) => {
      const result = await client.get("/pending_emails.json", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_pending_email",
    "Get a single pending email by ID",
    { id: z.number().describe("Pending email ID") },
    async ({ id }) => {
      const result = await client.get(`/pending_emails/${id}.json`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_update_pending_email",
    "Update a pending email (modify before it sends)",
    {
      id: z.number().describe("Pending email ID"),
      subject: z.string().optional().describe("Email subject"),
      body: z.string().optional().describe("Email body (HTML)"),
    },
    async ({ id, ...body }) => {
      const result = await client.put(`/pending_emails/${id}.json`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_delete_pending_email",
    "Delete/cancel a pending email",
    { id: z.number().describe("Pending email ID") },
    async ({ id }) => {
      await client.del(`/pending_emails/${id}.json`);
      return { content: [{ type: "text", text: `Pending email ${id} cancelled.` }] };
    }
  );
}
