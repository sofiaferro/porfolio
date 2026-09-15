import { getResume } from "@/lib/content";

export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(getResume(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
