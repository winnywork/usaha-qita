import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const dataToUpdate: Record<string, unknown> = {};
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.surveyNotes !== undefined) dataToUpdate.surveyNotes = body.surveyNotes;
    if (body.creditAssessment !== undefined) {
      dataToUpdate.creditAssessmentJson = JSON.stringify(body.creditAssessment);
    }
    dataToUpdate.lastUpdated = new Date();

    const updated = await prisma.lead.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        submittedAt: updated.submittedAt.toISOString(),
        lastUpdated: updated.lastUpdated.toISOString(),
        marketIntelligence: JSON.parse(updated.marketIntelligenceJson),
        financialMetrics: JSON.parse(updated.financialMetricsJson),
        creditAssessment: updated.creditAssessmentJson ? JSON.parse(updated.creditAssessmentJson) : undefined,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    console.error("Failed to update lead in MySQL:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
