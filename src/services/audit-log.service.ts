import { auditLogRepo } from "@/repositories/audit-log.repo";
import type { LimitQueryInput } from "@/lib/validations/common.schema";

export const auditLogService = {
  /**
   * Lists audit logs with an optional limit.
   */
  async list(query: LimitQueryInput) {
    return auditLogRepo.findMany(query);
  },
};
