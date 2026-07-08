import { prisma } from "@/lib/prisma";

const CATEGORY_WEIGHTS: Record<string, number> = {
  disasterRelief: 10.0,
  health: 9.0,
  povertyAlleviation: 7.5,
  humanRights: 7.0,
  animalWelfare: 5.5,
  environment: 5.0,
  education: 4.0,
  communityDevelopment: 3.5,
  artsAndCulture: 2.0,
  other: 3.0,
};


interface NeedItem {
  id: string;
  peopleAffected: number | null;
  hasDeadline: boolean;
  deadLine: Date | null;
  ProblemCategory: string;
  createdAt: Date;
}

function calculateUrgencyScore(need: NeedItem,maxAffected: number): number {
  const now = new Date();
  const categoryBase =CATEGORY_WEIGHTS[need.ProblemCategory] ??CATEGORY_WEIGHTS.other;
  const categoryScore = (categoryBase / 10) * 7;
  const affected = need.peopleAffected ?? 0;
  const safeMax = Math.max(maxAffected, 1);
  const impactRatio =Math.log10(affected + 1) /Math.log10(safeMax + 1);

  const impactScore = Math.min(2, impactRatio * 2);

  let timeScore = 0;

  if (need.hasDeadline && need.deadLine) {
    const msLeft =need.deadLine.getTime() - now.getTime();
    const hoursLeft =
      msLeft / (1000 * 60 * 60);

    if (hoursLeft <= 0) {
      timeScore = 1;
    } else {
      timeScore = Math.max(
        0,
        1 - hoursLeft / (24 * 7)
      );
    }
  }
  else {
    const msOld =
      now.getTime() - need.createdAt.getTime();
    const daysOld =
      msOld / (1000 * 60 * 60 * 24);
    timeScore = Math.min(0.5, daysOld / 30);
  }

  const finalScore =
    categoryScore +
    impactScore +
    timeScore;
  return Number(
    Math.min(10, Math.max(0, finalScore)).toFixed(2)
  );
}

export async function recalculateAllUrgency() {
  try {
    const [needs, aggregate] =
      await prisma.$transaction([
        prisma.communityNeeds.findMany({
          where: {
            status: {
              not: "resolved",
            },
          },
          select: {
            id: true,
            peopleAffected: true,
            hasDeadline: true,
            deadLine: true,
            ProblemCategory: true,
            createdAt: true,
          },
        }),

        prisma.communityNeeds.aggregate({
          where: {
            status: {
              not: "resolved",
            },
          },
          _max: {
            peopleAffected: true,
          },
        }),
      ]);

    if (needs.length === 0) {
      return {
        success: true,
        message:
          "No active community needs found.",
      };
    }

    const maxAffected =
      aggregate._max.peopleAffected ?? 1;
    const updates = needs.map((need) => {
      const urgencyScore =
        calculateUrgencyScore(
          need,
          maxAffected
        );
      return prisma.communityNeeds.update({
        where: {
          id: need.id,
        },
        data: {
          urgencyLevel: Math.round(
            urgencyScore
          ),
        },
      });
    });
    const BATCH_SIZE = 100;
    for (
      let i = 0;
      i < updates.length;
      i += BATCH_SIZE
    ) {
      const batch = updates.slice(
        i,
        i + BATCH_SIZE
      );

      await prisma.$transaction(batch);
    }
    return {
      success: true,
      message: `Successfully updated ${updates.length} urgency scores.`,
    };
  } catch (error) {
    console.error(
      "Urgency recalculation failed:",
      error
    );
    return {
      success: false,
      message:
        "Failed to recalculate urgency scores.",
    };
  }
}