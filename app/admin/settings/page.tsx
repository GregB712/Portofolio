import { AdminHeader } from "@/components/layout/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteCvDocumentAction,
  deleteLandingAvatarAction,
  deleteProfilePhotoAction,
  uploadCvDocumentAction,
  uploadLandingAvatarAction,
  uploadProfilePhotoAction
} from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";

const requiredEnv = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "GITHUB_ID",
  "GITHUB_SECRET",
  "ADMIN_EMAIL",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "GITHUB_TOKEN"
];

export const dynamic = "force-dynamic";

async function getProfilePhotoPreview() {
  try {
    return {
      photo: await prisma.profilePhoto.findUnique({
        where: { id: "main" },
        select: {
          fileName: true,
          mimeType: true,
          updatedAt: true
        }
      }),
      error: null
    };
  } catch {
    return {
      photo: null,
      error:
        "The profile photo table is not available yet. Run `npx prisma migrate deploy` against the production Neon database, then redeploy or reload."
    };
  }
}

async function getLandingAvatarPreview() {
  try {
    return {
      avatar: await prisma.landingAvatar.findUnique({
        where: { id: "main" },
        select: {
          fileName: true,
          mimeType: true,
          updatedAt: true
        }
      }),
      error: null
    };
  } catch {
    return {
      avatar: null,
      error:
        "The landing avatar table is not available yet. Run `npx prisma migrate deploy` against the production Neon database, then redeploy or reload."
    };
  }
}

async function getCvDocumentPreview() {
  try {
    return {
      document: await prisma.cvDocument.findUnique({
        where: { id: "main" },
        select: {
          fileName: true,
          mimeType: true,
          updatedAt: true
        }
      }),
      error: null
    };
  } catch {
    return {
      document: null,
      error:
        "The CV document table is not available yet. Run `npx prisma migrate deploy` against the production Neon database, then redeploy or reload."
    };
  }
}

export default async function AdminSettingsPage() {
  const [
    { photo: profilePhoto, error: profilePhotoError },
    { avatar: landingAvatar, error: landingAvatarError },
    { document: cvDocument, error: cvDocumentError }
  ] = await Promise.all([getProfilePhotoPreview(), getLandingAvatarPreview(), getCvDocumentPreview()]);

  return (
    <>
      <AdminHeader title="Settings" subtitle="Deployment readiness checklist for Vercel, Neon, Auth.js, Resend, and GitHub sync." />
      <section className="glass mb-5 rounded-lg p-5">
        <h2 className="text-xl font-semibold">CV PDF</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Upload the PDF used by every CV download button. If no database PDF exists, downloads fall back to the static file in public.
        </p>
        {cvDocumentError ? (
          <div className="mt-4 rounded-md border border-[var(--accent-3)] bg-white/5 p-3 text-sm leading-6 text-[var(--accent-3)]">
            {cvDocumentError}
          </div>
        ) : null}
        <div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="grid aspect-[3/4] place-items-center rounded-lg border border-[var(--line)] bg-white/5 px-4 text-center">
            <div>
              <p className="text-4xl font-semibold text-[var(--accent)]">PDF</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {cvDocument ? "Database CV" : "Static fallback"}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-4 rounded-md border border-[var(--line)] bg-white/5 p-3 text-sm text-[var(--muted)]">
              {cvDocument ? (
                <>
                  <p>
                    Current file: <span className="text-[var(--foreground)]">{cvDocument.fileName ?? "uploaded CV"}</span>
                  </p>
                  <p>Type: {cvDocument.mimeType}</p>
                  <p>Updated: {cvDocument.updatedAt.toLocaleString("en")}</p>
                </>
              ) : (
                <p>Current file: static fallback at <span className="text-[var(--foreground)]">/Gregory_Barmpas_CV.pdf</span></p>
              )}
            </div>
            <div className="mb-4 flex flex-wrap gap-3">
              <a
                href="/api/cv"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-10 items-center rounded-md border border-[var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                Open current CV
              </a>
              <a
                href="/api/cv?download=1"
                className="focus-ring inline-flex min-h-10 items-center rounded-md border border-[var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                Download current CV
              </a>
            </div>
            <form action={uploadCvDocumentAction} className="grid gap-3">
              <input
                required
                type="file"
                name="cv"
                accept="application/pdf,.pdf"
                className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3 text-sm"
              />
              <Button type="submit" variant="primary" className="w-fit">
                Replace CV PDF
              </Button>
            </form>
            {cvDocument ? (
              <form action={deleteCvDocumentAction} className="mt-3">
                <Button type="submit" variant="danger">
                  Delete database CV
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
      <section className="glass mb-5 rounded-lg p-5">
        <h2 className="text-xl font-semibold">Landing page avatar</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Upload the portrait used in the landing page hero. If no avatar is uploaded, the site automatically falls back to the GitHub profile avatar.
        </p>
        {landingAvatarError ? (
          <div className="mt-4 rounded-md border border-[var(--accent-3)] bg-white/5 p-3 text-sm leading-6 text-[var(--accent-3)]">
            {landingAvatarError}
          </div>
        ) : null}
        <div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="aspect-[4/5] overflow-hidden rounded-lg border border-[var(--line)] bg-white/5">
            {landingAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/landing-avatar?updated=${landingAvatar.updatedAt.getTime()}`}
                alt="Current landing page avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--muted)]">
                Using GitHub avatar fallback
              </div>
            )}
          </div>
          <div>
            {landingAvatar ? (
              <div className="mb-4 rounded-md border border-[var(--line)] bg-white/5 p-3 text-sm text-[var(--muted)]">
                <p>
                  Current file: <span className="text-[var(--foreground)]">{landingAvatar.fileName ?? "uploaded image"}</span>
                </p>
                <p>Type: {landingAvatar.mimeType}</p>
              </div>
            ) : null}
            <form action={uploadLandingAvatarAction} className="grid gap-3">
              <input
                required
                type="file"
                name="avatar"
                accept="image/jpeg,image/png,image/webp"
                className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3 text-sm"
              />
              <Button type="submit" variant="primary" className="w-fit">
                Upload landing avatar
              </Button>
            </form>
            {landingAvatar ? (
              <form action={deleteLandingAvatarAction} className="mt-3">
                <Button type="submit" variant="danger">
                  Delete landing avatar
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
      <section className="glass mb-5 rounded-lg p-5">
        <h2 className="text-xl font-semibold">CV profile photo</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Upload a JPG, PNG, or WebP portrait. The image is stored in the database and shown on the web CV page.
        </p>
        {profilePhotoError ? (
          <div className="mt-4 rounded-md border border-[var(--accent-3)] bg-white/5 p-3 text-sm leading-6 text-[var(--accent-3)]">
            {profilePhotoError}
          </div>
        ) : null}
        <div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="aspect-square overflow-hidden rounded-lg border border-[var(--line)] bg-white/5">
            {profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/profile-photo?updated=${profilePhoto.updatedAt.getTime()}`}
                alt="Current CV profile photo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--muted)]">
                No photo uploaded
              </div>
            )}
          </div>
          <div>
            {profilePhoto ? (
              <div className="mb-4 rounded-md border border-[var(--line)] bg-white/5 p-3 text-sm text-[var(--muted)]">
                <p>
                  Current file: <span className="text-[var(--foreground)]">{profilePhoto.fileName ?? "uploaded image"}</span>
                </p>
                <p>Type: {profilePhoto.mimeType}</p>
              </div>
            ) : null}
            <form action={uploadProfilePhotoAction} className="grid gap-3">
              <input
                required
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3 text-sm"
              />
              <Button type="submit" variant="primary" className="w-fit">
                Upload photo
              </Button>
            </form>
            {profilePhoto ? (
              <form action={deleteProfilePhotoAction} className="mt-3">
                <Button type="submit" variant="danger">
                  Delete photo
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
      <section className="glass rounded-lg p-5">
        <h2 className="text-xl font-semibold">Environment</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {requiredEnv.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-md border border-[var(--line)] p-3">
              <code className="text-sm">{key}</code>
              <Badge className={process.env[key] ? "border-[var(--accent)]" : ""}>
                {process.env[key] ? "configured" : "missing"}
              </Badge>
            </div>
          ))}
        </div>
      </section>
      <section className="glass mt-5 rounded-lg p-5">
        <h2 className="text-xl font-semibold">Operational notes</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
          <li>Run Prisma migrations against Neon before deploying the public site.</li>
          <li>Seed projects with the provided script, then refine copy in the admin dashboard.</li>
          <li>Use a GitHub token for higher sync rate limits.</li>
          <li>Resend forwarding requires a verified sender domain for production delivery.</li>
          <li>Analytics hash IPs and store event/page metadata without retaining raw addresses.</li>
        </ul>
      </section>
    </>
  );
}
