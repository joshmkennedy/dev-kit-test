-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "copyId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Translation_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "Copy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Copy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT,
    "description" TEXT,
    "createdAt" DATETIME,
    "updatedAt" DATETIME
);
INSERT INTO "new_Copy" ("content", "createdAt", "description", "id", "updatedAt") SELECT "content", "createdAt", "description", "id", "updatedAt" FROM "Copy";
DROP TABLE "Copy";
ALTER TABLE "new_Copy" RENAME TO "Copy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Translation_copyId_locale_key" ON "Translation"("copyId", "locale");
