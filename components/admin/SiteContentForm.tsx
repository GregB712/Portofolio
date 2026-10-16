import { Button } from "@/components/ui/button";
import type { SiteContentView } from "@/lib/site-content";

type SiteContentFormProps = {
  action: (formData: FormData) => Promise<void>;
  content: SiteContentView;
};

export function SiteContentForm({ action, content }: SiteContentFormProps) {
  return (
    <form action={action} className="glass grid gap-5 rounded-lg p-5">
      <div>
        <h2 className="text-xl font-semibold">Hero</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Status badge, name, location, title, and subtitle at the top of the landing page.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Status badge" name="heroStatus" defaultValue={content.heroStatus} required />
        <Field label="Name" name="heroName" defaultValue={content.heroName} required />
      </div>
      <Field label="Location" name="heroLocation" defaultValue={content.heroLocation} required />
      <TextArea label="Title" name="heroTitle" defaultValue={content.heroTitle} rows={3} required />
      <TextArea label="Subtitle" name="heroSubtitle" defaultValue={content.heroSubtitle} rows={3} required />

      <div className="mt-2 border-t border-[var(--line)] pt-5">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Heading, summary, and highlight chips in the About section.</p>
      </div>
      <TextArea label="About heading" name="aboutTitle" defaultValue={content.aboutTitle} rows={2} required />
      <TextArea label="Summary" name="aboutSummary" defaultValue={content.aboutSummary} rows={5} required />
      <TextArea
        label="Highlight chips"
        name="aboutHighlights"
        defaultValue={content.aboutHighlights.join("\n")}
        rows={6}
        help="One per line"
      />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save content
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  help,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  help?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        name={name}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
        {...props}
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  help,
  defaultValue,
  rows = 4,
  required
}: {
  label: string;
  name: string;
  help?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}
