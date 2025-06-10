-- CreateEnum
CREATE TYPE "networks" AS ENUM ('google', 'facebook', 'github', 'normal');

-- CreateEnum
CREATE TYPE "Complaint" AS ENUM ('pending', 'resolved', 'rejected');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "username" VARCHAR(100),
    "email" VARCHAR(50) NOT NULL,
    "type" "networks" NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_gamer" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_gamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_gamer_steps" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "audio_url" VARCHAR(150),
    "step_order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lesson_gamerId" UUID NOT NULL,

    CONSTRAINT "lesson_gamer_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "video_url" VARCHAR(150),
    "audio_url" VARCHAR(150),
    "quiz_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lesson_level" INTEGER NOT NULL DEFAULT 1,
    "quiz_level" INTEGER NOT NULL DEFAULT 1,
    "completed_at" TIMESTAMP(3),
    "score" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adminMessage" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "status" "Complaint" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adminMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramNote" (
    "id" UUID NOT NULL,
    "chatId" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(100) NOT NULL,
    "language_code" VARCHAR(10) NOT NULL,
    "message" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "page" TEXT NOT NULL,
    "page_order" INTEGER NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writeBookTypeng" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "saved_page_order" INTEGER NOT NULL DEFAULT 1,
    "audio_url" VARCHAR(150) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writeBookTypeng_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessonCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "lessonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "videoUrl" VARCHAR(100) NOT NULL,
    "categoryId" UUID NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "code" VARCHAR(3) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translate" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "translate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "definition" (
    "id" UUID NOT NULL,
    "value" JSONB NOT NULL,
    "languageId" UUID NOT NULL,
    "translateId" UUID NOT NULL,

    CONSTRAINT "definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" UUID NOT NULL,
    "name" UUID NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lessonCategory_name_key" ON "lessonCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "language_code_key" ON "language"("code");

-- AddForeignKey
ALTER TABLE "lesson_gamer_steps" ADD CONSTRAINT "lesson_gamer_steps_lesson_gamerId_fkey" FOREIGN KEY ("lesson_gamerId") REFERENCES "lesson_gamer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminMessage" ADD CONSTRAINT "adminMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writeBookTypeng" ADD CONSTRAINT "writeBookTypeng_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writeBookTypeng" ADD CONSTRAINT "writeBookTypeng_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "lessonCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_translateId_fkey" FOREIGN KEY ("translateId") REFERENCES "translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_name_fkey" FOREIGN KEY ("name") REFERENCES "translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
