-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postImg" TEXT,
ALTER COLUMN "post" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverImg" TEXT,
ADD COLUMN     "profileImg" TEXT;
