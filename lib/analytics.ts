import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type TrackOptions = {
  path: string;
  eventName?: string;
  metadata?: Record<string, unknown>;
};

function firstHeader(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function hashIp(ip: string | null) {
  if (!ip) return null;
  const salt = process.env.AUTH_SECRET || process.env.DATABASE_URL || "portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function getDeviceType(userAgent: string | null) {
  const value = userAgent?.toLowerCase() ?? "";
  if (/ipad|tablet/.test(value)) return "tablet";
  if (/mobile|iphone|android/.test(value)) return "mobile";
  return "desktop";
}

function getBrowser(userAgent: string | null) {
  const value = userAgent?.toLowerCase() ?? "";
  if (value.includes("edg/")) return "Edge";
  if (value.includes("chrome/")) return "Chrome";
  if (value.includes("safari/")) return "Safari";
  if (value.includes("firefox/")) return "Firefox";
  return "Other";
}

export async function requestContext() {
  const headerList = await headers();
  const ip =
    firstHeader(headerList.get("x-forwarded-for")) ??
    firstHeader(headerList.get("x-real-ip")) ??
    null;

  return {
    ipHash: hashIp(ip),
    userAgent: headerList.get("user-agent"),
    referrer: headerList.get("referer"),
    country: headerList.get("x-vercel-ip-country"),
    deviceType: getDeviceType(headerList.get("user-agent")),
    browser: getBrowser(headerList.get("user-agent"))
  };
}

export async function trackPageView(path: string) {
  try {
    const context = await requestContext();
    await prisma.pageView.create({
      data: {
        path,
        referrer: context.referrer,
        userAgent: context.userAgent,
        country: context.country,
        deviceType: context.deviceType,
        browser: context.browser,
        ipHash: context.ipHash
      }
    });
  } catch (error) {
    console.error("Failed to track page view", error);
  }
}

export async function trackEvent({ path, eventName = "page_view", metadata }: TrackOptions) {
  try {
    const context = await requestContext();
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        path,
        metadata: metadata as Prisma.InputJsonValue | undefined,
        ipHash: context.ipHash,
        userAgent: context.userAgent
      }
    });
  } catch (error) {
    console.error("Failed to track analytics event", error);
  }
}

export async function analyticsSince(range: "today" | "7d" | "30d" | "all" = "30d") {
  const now = new Date();
  const start = new Date(now);

  if (range === "today") start.setHours(0, 0, 0, 0);
  if (range === "7d") start.setDate(now.getDate() - 7);
  if (range === "30d") start.setDate(now.getDate() - 30);

  return range === "all" ? undefined : start;
}
