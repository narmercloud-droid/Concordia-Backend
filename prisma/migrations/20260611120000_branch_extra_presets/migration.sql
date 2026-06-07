-- CreateTable
CREATE TABLE "BranchExtraPreset" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "minSelect" INTEGER NOT NULL DEFAULT 0,
    "maxSelect" INTEGER NOT NULL DEFAULT 5,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchExtraPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchExtraPresetOption" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BranchExtraPresetOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchExtraPresetCategory" (
    "presetId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "BranchExtraPresetCategory_pkey" PRIMARY KEY ("presetId","categoryId")
);

-- AddForeignKey
ALTER TABLE "BranchExtraPreset" ADD CONSTRAINT "BranchExtraPreset_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchExtraPresetOption" ADD CONSTRAINT "BranchExtraPresetOption_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "BranchExtraPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchExtraPresetCategory" ADD CONSTRAINT "BranchExtraPresetCategory_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "BranchExtraPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchExtraPresetCategory" ADD CONSTRAINT "BranchExtraPresetCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BranchCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
