
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { source } = req.query;

  if (!source) {
    return res.status(400).json({ message: "Missing source parameter" });
  }

  try {
    const value = await redis.hget("redirects", source);

    if (value) {
      const data = typeof value === "string" ? JSON.parse(value) : value;
      return res.status(200).json({
        found: true,
        source,
        destination: data.destination || "[no destination]",
      });
    } else {
      return res.status(200).json({
        found: false,
        source,
      });
    }
  } catch (error) {
    console.error("Redis error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
