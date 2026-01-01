// Manual type declarations for Cloudflare environment variables
// This augments the Env interface and won't be overwritten by `wrangler types`
declare namespace Cloudflare {
  interface Env {
    GOOGLE_GENERATIVE_AI_API_KEY: string
  }
}
