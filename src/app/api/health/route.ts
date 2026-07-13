import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      seeded: Boolean(settings),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        status: "error",
        database: "failed",
        message,
      },
      { status: 500 },
    );
  }
}
