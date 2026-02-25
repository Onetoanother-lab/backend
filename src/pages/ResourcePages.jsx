// Each page passes its field config to GenericCrudPage.
// Fields follow the flat multilingual pattern: title_uz, title_oz, title_ru

import GenericCrudPage from '../components/GenericCrudPage'

// ─── Shared field builders ────────────────────────────────────────────────────

const mlText = (base, label, required = false) => [
  { key: `${base}_uz`, label: `${label} (UZ)`, required },
  { key: `${base}_oz`, label: `${label} (OZ)` },
  { key: `${base}_ru`, label: `${label} (RU)` },
]

const mlTextarea = (base, label, required = false) => [
  { key: `${base}_uz`, label: `${label} (UZ)`, type: 'textarea', required },
  { key: `${base}_oz`, label: `${label} (OZ)`, type: 'textarea' },
  { key: `${base}_ru`, label: `${label} (RU)`, type: 'textarea' },
]

// ─── Banner ───────────────────────────────────────────────────────────────────
export function BannerPage() {
  return (
    <GenericCrudPage
      title="Banners"
      endpoint="/api/banner"
      description="Manage hero and promotional banners."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description'),
        { key: 'file', label: 'Image', type: 'file', required: true },
        { key: 'link', label: 'Link URL' },
        { key: 'isActive', label: 'Active', type: 'toggle' },
      ]}
    />
  )
}

// ─── Gender ───────────────────────────────────────────────────────────────────
export function GenderPage() {
  return (
    <GenericCrudPage
      title="Gender Policy"
      endpoint="/api/gender"
      description="Manage gender policy content."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
      ]}
    />
  )
}

// ─── Honorary ─────────────────────────────────────────────────────────────────
export function HonoraryPage() {
  return (
    <GenericCrudPage
      title="Honorary Members"
      endpoint="/api/honorary"
      description="Manage honorary staff and award recipients."
      fields={[
        ...mlText('name', 'Full Name', true),
        ...mlText('position', 'Position'),
        ...mlTextarea('description', 'Description'),
        { key: 'file', label: 'Photo', type: 'file' },
        { key: 'year', label: 'Year', type: 'number' },
      ]}
    />
  )
}

// ─── Industry News ────────────────────────────────────────────────────────────
export function IndustryNewsPage() {
  return (
    <GenericCrudPage
      title="Industry News"
      endpoint="/api/IndustryNews"
      description="News and updates from the oil & gas industry."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Cover Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'published', label: 'Published', type: 'toggle' },
      ]}
    />
  )
}

// ─── Leaders ─────────────────────────────────────────────────────────────────
export function LeaderPage() {
  return (
    <GenericCrudPage
      title="Leaders"
      endpoint="/api/leader"
      description="Company leadership profiles."
      fields={[
        ...mlText('name', 'Full Name', true),
        ...mlText('position', 'Position', true),
        ...mlTextarea('description', 'Biography'),
        { key: 'file', label: 'Photo', type: 'file' },
        { key: 'order', label: 'Display Order', type: 'number' },
        { key: 'isActive', label: 'Active', type: 'toggle' },
      ]}
    />
  )
}

// ─── Local News ───────────────────────────────────────────────────────────────
export function LocalNewsPage() {
  return (
    <GenericCrudPage
      title="Local News"
      endpoint="/api/localnews"
      description="Local and regional news articles."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Cover Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'published', label: 'Published', type: 'toggle' },
      ]}
    />
  )
}

// ─── News ─────────────────────────────────────────────────────────────────────
export function NewsPage() {
  return (
    <GenericCrudPage
      title="News"
      endpoint="/api/news"
      description="Main news feed — articles and announcements."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Cover Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'published', label: 'Published', type: 'toggle' },
      ]}
    />
  )
}

// ─── Normative ────────────────────────────────────────────────────────────────
export function NormativePage() {
  return (
    <GenericCrudPage
      title="Normative Documents"
      endpoint="/api/normative/all"
      description="Legal and regulatory documents."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlText('decree', 'Decree', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Document File', type: 'file', required: true },
      ]}
    />
  )
}

// ─── Bolimlar (Departments) ───────────────────────────────────────────────────
export function BolimlarPage() {
  return (
    <GenericCrudPage
      title="Bolimlar"
      endpoint="/api/bolimlar"
      description="Company departments and divisions."
      fields={[
        ...mlText('name', 'Department Name', true),
        ...mlTextarea('description', 'Description'),
        { key: 'file', label: 'Image', type: 'file' },
        { key: 'order', label: 'Display Order', type: 'number' },
      ]}
    />
  )
}

// ─── Vacancies ────────────────────────────────────────────────────────────────
export function VacanciesPage() {
  return (
    <GenericCrudPage
      title="Vacancies"
      endpoint="/api/vacancies"
      description="Job openings and recruitment listings."
      fields={[
        ...mlText('title', 'Job Title', true),
        ...mlText('position', 'Department / Position'),
        ...mlTextarea('description', 'Description', true),
        ...mlTextarea('requirements', 'Requirements'),
        { key: 'salary', label: 'Salary Range' },
        { key: 'deadline', label: 'Application Deadline', type: 'date' },
        { key: 'isActive', label: 'Active', type: 'toggle' },
      ]}
    />
  )
}

// ─── Xotin-Qizlar ─────────────────────────────────────────────────────────────
export function XotinQizlarPage() {
  return (
    <GenericCrudPage
      title="Xotin-Qizlar"
      endpoint="/api/XotinQizlar"
      description="Women's policy content and resources."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'published', label: 'Published', type: 'toggle' },
      ]}
    />
  )
}

// ─── Yoshlar Siyosati ─────────────────────────────────────────────────────────
export function YoshlarPage() {
  return (
    <GenericCrudPage
      title="Yoshlar Siyosati"
      endpoint="/api/Yoshlar siyosati"
      description="Youth policy programs and initiatives."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description', true),
        { key: 'file', label: 'Image', type: 'file' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'published', label: 'Published', type: 'toggle' },
      ]}
    />
  )
}

// ─── Plans & Reports ─────────────────────────────────────────────────────────
export function PlansReportsPage() {
  return (
    <GenericCrudPage
      title="Plans & Reports"
      endpoint="/api/plansReports"
      description="Annual plans, reports, and performance documents."
      fields={[
        ...mlText('title', 'Title', true),
        ...mlTextarea('description', 'Description'),
        { key: 'file', label: 'Document File', type: 'file', required: true },
        { key: 'year', label: 'Year', type: 'number' },
        { key: 'type', label: 'Type', type: 'select', options: [
          { value: 'plan',   label: 'Plan' },
          { value: 'report', label: 'Report' },
          { value: 'audit',  label: 'Audit' },
        ]},
      ]}
    />
  )
}
