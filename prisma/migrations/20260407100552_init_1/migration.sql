-- CreateTable
CREATE TABLE "NFT" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFT_id_key" ON "NFT"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_txHash_key" ON "NFT"("txHash");
