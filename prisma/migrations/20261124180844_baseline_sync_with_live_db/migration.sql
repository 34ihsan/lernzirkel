-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CourseCategory" ADD VALUE 'BERUFSBEZOGEN';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'PRUEFUNGSVORBEREITUNG';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'ALPHABETISIERUNG';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'ERSTORIENTIERUNG';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'FRAUENKURSE';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'FERIENKURSE';
ALTER TYPE "public"."CourseCategory" ADD VALUE 'WEITERBILDUNG';

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "allowWaitlist" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "design" JSONB;

-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "design" JSONB;

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "actionText" TEXT,
ADD COLUMN     "actionUrl" TEXT,
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "fundingSource" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "partners" TEXT,
ADD COLUMN     "results" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."TeamMember" ADD COLUMN     "adminRole" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "permissions" JSONB,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "teacherReportToken" TEXT,
ADD COLUMN     "teacherReportTokenAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCloseable" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "targetScope" TEXT NOT NULL DEFAULT 'ALL',
    "targetPageSlugs" TEXT[],
    "type" TEXT NOT NULL DEFAULT 'banner',
    "position" TEXT NOT NULL DEFAULT 'top',
    "backgroundColor" TEXT NOT NULL DEFAULT '#1a6d92',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "borderColor" TEXT NOT NULL DEFAULT 'transparent',
    "fontSize" TEXT NOT NULL DEFAULT '14px',
    "fontWeight" TEXT NOT NULL DEFAULT 'normal',
    "padding" TEXT NOT NULL DEFAULT '12px 16px',
    "icon" TEXT NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "animation" TEXT NOT NULL DEFAULT 'none',
    "animationSpeed" TEXT NOT NULL DEFAULT 'normal',
    "duration" INTEGER NOT NULL DEFAULT 7,
    "linkText" TEXT,
    "linkUrl" TEXT,
    "translations" JSONB,
    "isInline" BOOLEAN NOT NULL DEFAULT true,
    "showCountdown" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'ALLGEMEIN',
    "tags" TEXT,
    "author" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishAt" TIMESTAMP(3),

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleTranslation" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ArticleTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "adminUser" TEXT NOT NULL DEFAULT 'Admin',
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampaignLink" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'other',
    "showOnBioPage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CampaignLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactMessage" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "details" JSONB,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNREAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentRevision" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseTranslation" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAudience" TEXT,
    "requirements" TEXT,
    "costsInfo" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CourseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventLog" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "locale" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobPosition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsTranslation" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "publishAt" TIMESTAMP(3),
    "contentVersion" INTEGER NOT NULL DEFAULT 0,
    "draftData" JSONB,
    "draftSavedAt" TIMESTAMP(3),
    "lastEditedAt" TIMESTAMP(3),
    "lastEditedById" TEXT,
    "lastEditedByName" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "ogImage" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PageTranslation" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectTranslation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goals" TEXT,
    "targetGroup" TEXT,
    "results" TEXT,
    "actionText" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "language" TEXT NOT NULL DEFAULT 'de',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isWaitlisted" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "source" TEXT,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Section" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "design" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SectionTranslation" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "siteName" TEXT NOT NULL DEFAULT 'Lernzirkel Ludwigshafen e.V.',
    "description" TEXT NOT NULL DEFAULT 'Bildung, Beratung und soziale Projekte',
    "primaryColor" TEXT NOT NULL DEFAULT '#0F4761',
    "primaryLight" TEXT NOT NULL DEFAULT '#1a6d92',
    "secondaryColor" TEXT NOT NULL DEFAULT '#e8f4f8',
    "accentColor" TEXT NOT NULL DEFAULT '#e63946',
    "backgroundColor" TEXT NOT NULL DEFAULT '#fbfbfb',
    "foregroundColor" TEXT NOT NULL DEFAULT '#333333',
    "mutedColor" TEXT NOT NULL DEFAULT '#f1f1f1',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "footerConfig" JSONB,
    "headerConfig" JSONB,
    "designConfig" JSONB,
    "aiConfig" JSONB,
    "marketingConfig" JSONB,
    "securityConfig" JSONB,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "teacherSnapshot" TEXT,
    "language" TEXT NOT NULL DEFAULT 'de',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "remindersSent" INTEGER NOT NULL DEFAULT 0,
    "lastReminderAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryStatus" TEXT,
    "deliveryStatusAt" TIMESTAMP(3),
    "resendEmailId" TEXT,

    CONSTRAINT "SurveyInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyQuestion" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "translations" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyResponse" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseTitleSnapshot" TEXT NOT NULL,
    "categorySnapshot" TEXT,
    "teacherSnapshot" TEXT,
    "language" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "public"."Article"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTranslation_articleId_language_key" ON "public"."ArticleTranslation"("articleId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "CampaignLink_isActive_idx" ON "public"."CampaignLink"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignLink_slug_key" ON "public"."CampaignLink"("slug" ASC);

-- CreateIndex
CREATE INDEX "ContentRevision_modelName_recordId_createdAt_idx" ON "public"."ContentRevision"("modelName" ASC, "recordId" ASC, "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "CourseTranslation_courseId_language_key" ON "public"."CourseTranslation"("courseId" ASC, "language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "NewsTranslation_newsId_language_key" ON "public"."NewsTranslation"("newsId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "Page_isPublished_idx" ON "public"."Page"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "Page_parentId_order_idx" ON "public"."Page"("parentId" ASC, "order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "public"."Page"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PageTranslation_pageId_language_key" ON "public"."PageTranslation"("pageId" ASC, "language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_language_key" ON "public"."ProjectTranslation"("projectId" ASC, "language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "public"."Redirect"("fromPath" ASC);

-- CreateIndex
CREATE INDEX "Registration_assignedToId_idx" ON "public"."Registration"("assignedToId" ASC);

-- CreateIndex
CREATE INDEX "Registration_courseId_status_idx" ON "public"."Registration"("courseId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "Registration_source_idx" ON "public"."Registration"("source" ASC);

-- CreateIndex
CREATE INDEX "Section_pageId_order_idx" ON "public"."Section"("pageId" ASC, "order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SectionTranslation_sectionId_language_key" ON "public"."SectionTranslation"("sectionId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "SurveyInvite_courseId_status_idx" ON "public"."SurveyInvite"("courseId" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyInvite_registrationId_key" ON "public"."SurveyInvite"("registrationId" ASC);

-- CreateIndex
CREATE INDEX "SurveyInvite_resendEmailId_idx" ON "public"."SurveyInvite"("resendEmailId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyInvite_token_key" ON "public"."SurveyInvite"("token" ASC);

-- CreateIndex
CREATE INDEX "SurveyQuestion_section_order_idx" ON "public"."SurveyQuestion"("section" ASC, "order" ASC);

-- CreateIndex
CREATE INDEX "SurveyResponse_courseId_idx" ON "public"."SurveyResponse"("courseId" ASC);

-- CreateIndex
CREATE INDEX "SurveyResponse_submittedAt_idx" ON "public"."SurveyResponse"("submittedAt" ASC);

-- CreateIndex
CREATE INDEX "Course_isActive_category_idx" ON "public"."Course"("isActive" ASC, "category" ASC);

-- CreateIndex
CREATE INDEX "News_archiveDate_idx" ON "public"."News"("archiveDate" ASC);

-- CreateIndex
CREATE INDEX "News_publishDate_idx" ON "public"."News"("publishDate" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug" ASC);

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "public"."Project"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teacherReportToken_key" ON "public"."TeamMember"("teacherReportToken" ASC);

-- AddForeignKey
ALTER TABLE "public"."ArticleTranslation" ADD CONSTRAINT "ArticleTranslation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseTranslation" ADD CONSTRAINT "CourseTranslation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsTranslation" ADD CONSTRAINT "NewsTranslation_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "public"."News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PageTranslation" ADD CONSTRAINT "PageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SectionTranslation" ADD CONSTRAINT "SectionTranslation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyInvite" ADD CONSTRAINT "SurveyInvite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyInvite" ADD CONSTRAINT "SurveyInvite_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyResponse" ADD CONSTRAINT "SurveyResponse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

