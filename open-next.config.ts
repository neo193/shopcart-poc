// OpenNext adapter config for deploying to Cloudflare Workers.
// No incremental cache is configured: the POC has no server data to cache.
// When Supabase is added, see https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
