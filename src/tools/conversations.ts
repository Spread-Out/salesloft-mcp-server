import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as client from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "salesloft_list_conversations",
    "List Conversations recordings. Each item includes owner_id/user_guid (the rep), title, call_id, account, and duration.",
    {
      page: z.number().optional().describe("Page number"),
      per_page: z.number().min(1).max(100).optional().describe("Records per page"),
      sort_by: z.string().optional().describe("Field to sort by"),
      sort_direction: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
    },
    async (params) => {
      const result = await client.get("/conversations.json", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_conversation",
    "Get a single Conversation recording by its UUID. Returns owner_id/user_guid, title, call_id, account, and duration.",
    { id: z.string().describe("Conversation UUID") },
    async ({ id }) => {
      const result = await client.get(`/conversations/${id}.json`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_conversation_recording",
    "Get the media for a Conversation: recording url, content_type, duration, and media_id.",
    { id: z.string().describe("Conversation UUID") },
    async ({ id }) => {
      const result = await client.get(`/conversations/${id}/recording.json`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_list_transcriptions",
    "List transcriptions. Each item links to its conversation and exposes a sentences href for the transcript text.",
    {
      page: z.number().optional().describe("Page number"),
      per_page: z.number().min(1).max(100).optional().describe("Records per page"),
      sort_by: z.string().optional().describe("Field to sort by"),
      sort_direction: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
    },
    async (params) => {
      const result = await client.get("/transcriptions.json", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_transcription",
    "Get a single transcription's metadata by UUID (language, conversation link, sentences href).",
    { id: z.string().describe("Transcription UUID") },
    async ({ id }) => {
      const result = await client.get(`/transcriptions/${id}.json`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "salesloft_get_transcription_sentences",
    "Get the transcript text for a recording: per-sentence text with start_time, end_time, order_number, and recording_attendee_id (speaker). Sort by order_number ascending to read in spoken order.",
    { id: z.string().describe("Transcription UUID") },
    async ({ id }) => {
      const result = await client.get(`/transcriptions/${id}/sentences.json`);
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
