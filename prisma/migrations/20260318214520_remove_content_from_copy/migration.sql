/*
  Warnings:

  - You are about to drop the column `content` on the `Copy` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Copy` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Copy` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Copy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT
);
INSERT INTO "new_Copy" ("description", "id") SELECT "description", "id" FROM "Copy";
DROP TABLE "Copy";
ALTER TABLE "new_Copy" RENAME TO "Copy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
