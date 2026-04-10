/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `txHash` on the `Job` table. All the data in the column will be lost.
  - Added the required column `data` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "imageUrl",
DROP COLUMN "txHash",
ADD COLUMN     "data" JSONB NOT NULL;
