// Edge Function-и МУВАҚҚАТӢ барои боргирии китобҳо (калиди сервер фақат дар сервер, дар чат не).
// 1) HASH-ро бо ҳэши токен иваз кунед. 2) Ба Supabase deploy кунед (verify_jwt=false). 3) payload.json-ро POST кунед бо header x-import-token.
// 4) ДАРҲОЛ бо `Deno.serve(() => new Response("gone",{status:410}))` ва verify_jwt=true иваз кунед.
import { createClient } from "jsr:@supabase/supabase-js@2";
const H = "HASH";
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
async function gz(s: string): Promise<Blob> { const cs = new CompressionStream("gzip"); const w = cs.writable.getWriter(); w.write(new TextEncoder().encode(s)); w.close(); return await new Response(cs.readable).blob(); }
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("no", { status: 405 });
  const dig = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(req.headers.get("x-import-token") || "")));
  if (dig !== H) return new Response("forbidden", { status: 403 });
  const { items } = await req.json();
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const res: unknown[] = [];
  for (const it of items) {
    const row = { ...it.row, published: false }; // ҳамеша пинҳон
    const up = await sb.storage.from("books").upload(row.text_path, await gz(JSON.stringify(it.book)), { upsert: true, contentType: "application/gzip" });
    if (up.error) { res.push({ slug: row.slug, err: "storage: " + up.error.message }); continue; }
    const ex = await sb.from("books").select("id").eq("slug", row.slug).maybeSingle();
    const r = ex.data ? await sb.from("books").update(row).eq("id", ex.data.id) : await sb.from("books").insert(row);
    res.push({ slug: row.slug, err: r.error ? r.error.message : null });
  }
  return new Response(JSON.stringify(res), { headers: { "content-type": "application/json" } });
});
