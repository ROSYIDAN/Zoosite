import { prisma } from "@/lib/prisma";
import type { LimitQueryInput } from "@/lib/validations/common.schema";

export const auditLogRepo = {
  /**
   * Fetches audit logs with an optional limit.
   */
  async findMany(query: LimitQueryInput) {
    return prisma.audit_logs.findMany({
      take: query.limit,
    });
  },
};
