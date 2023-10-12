-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "nota" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Aluno" (
    "matricula" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nota" REAL NOT NULL,
    "grupoId" INTEGER NOT NULL,
    CONSTRAINT "Aluno_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Judge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "notas" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToJudge" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GroupToJudge_A_fkey" FOREIGN KEY ("A") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupToJudge_B_fkey" FOREIGN KEY ("B") REFERENCES "Judge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToJudge_AB_unique" ON "_GroupToJudge"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToJudge_B_index" ON "_GroupToJudge"("B");
