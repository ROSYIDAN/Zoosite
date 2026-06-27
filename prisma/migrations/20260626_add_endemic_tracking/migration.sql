-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('ENDEMIC', 'NATIVE', 'INTRODUCED', 'EXTINCT');

-- AlterTable: Add distribution_status to animal_distributions
ALTER TABLE "animal_distributions" 
ADD COLUMN "distribution_status" "DistributionStatus" NOT NULL DEFAULT 'NATIVE';

-- AlterTable: Add country_id to users
ALTER TABLE "users" 
ADD COLUMN "country_id" uuid,
ADD CONSTRAINT "fk_user_country" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "idx_animal_distributions_status" ON "animal_distributions"("distribution_status");
CREATE INDEX "idx_animal_distributions_country_status" ON "animal_distributions"("country_id", "distribution_status");
CREATE INDEX "idx_users_country" ON "users"("country_id");