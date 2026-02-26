// Each page passes its exact field config to GenericCrudPage.
// Fields match the backend API spec precisely.

import GenericCrudPage from '../components/GenericCrudPage'

// ─── Banner ───────────────────────────────────────────────────────────────────
export function BannerPage() {
  return (
    <GenericCrudPage
      title="Banners"
      endpoint="/api/banner"
      description="Manage hero and promotional banners."
      fields={[
        { key: 'file',     label: 'Image',        type: 'file',     required: true },
        { key: 'title_uz', label: 'Title (UZ)',                      required: true },
        { key: 'title_ru', label: 'Title (RU)' },
        { key: 'title_oz', label: 'Title (OZ)' },
        { key: 'desc_uz',  label: 'Description (UZ)', type: 'textarea' },
        { key: 'desc_ru',  label: 'Description (RU)', type: 'textarea' },
        { key: 'desc_oz',  label: 'Description (OZ)', type: 'textarea' },
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
        { key: 'title_uz',       label: 'Title (UZ)' },
        { key: 'title_oz',       label: 'Title (OZ)' },
        { key: 'title_ru',       label: 'Title (RU)' },
        { key: 'description_uz', label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_oz', label: 'Description (OZ)', type: 'textarea' },
        { key: 'description_ru', label: 'Description (RU)', type: 'textarea' },
        { key: 'file',           label: 'File', type: 'file' },
      ]}
    />
  )
}

// ─── Honorary ─────────────────────────────────────────────────────────────────
export function HonoraryPage() {
  return (
    <GenericCrudPage
      title="Honorary Members"
      endpoint="/api/honorary/create"
      description="Manage honorary staff and award recipients."
      fields={[
        { key: 'image',          label: 'Photo (Faxriy xodim rasmi)', type: 'file' },
        { key: 'fullName_uz',    label: 'Full Name (UZ)',    required: true },
        { key: 'fullName_ru',    label: 'Full Name (RU)' },
        { key: 'fullName_oz',    label: 'Full Name (OZ)' },
        { key: 'specialist_uz',  label: 'Specialist (UZ)',  required: true },
        { key: 'specialist_ru',  label: 'Specialist (RU)' },
        { key: 'specialist_oz',  label: 'Specialist (OZ)' },
        { key: 'grade_uz',       label: 'Grade (UZ)',       required: true },
        { key: 'grade_ru',       label: 'Grade (RU)' },
        { key: 'grade_oz',       label: 'Grade (OZ)' },
        { key: 'experience_uz',  label: 'Experience (UZ)',  type: 'textarea' },
        { key: 'experience_ru',  label: 'Experience (RU)',  type: 'textarea' },
        { key: 'experience_oz',  label: 'Experience (OZ)',  type: 'textarea' },
        { key: 'project_uz',     label: 'Project (UZ)',     type: 'textarea' },
        { key: 'project_ru',     label: 'Project (RU)',     type: 'textarea' },
        { key: 'project_oz',     label: 'Project (OZ)',     type: 'textarea' },
        { key: 'description_uz', label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_ru', label: 'Description (RU)', type: 'textarea' },
        { key: 'description_oz', label: 'Description (OZ)', type: 'textarea' },
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
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_ru', label: 'Title (RU)' },
        { key: 'title_oz', label: 'Title (OZ)' },
        { key: 'desc_uz',  label: 'Description (UZ)', type: 'textarea' },
        { key: 'desc_ru',  label: 'Description (RU)', type: 'textarea' },
        { key: 'desc_oz',  label: 'Description (OZ)', type: 'textarea' },
        { key: 'images',   label: 'Images',            type: 'multi-file' },
      ]}
    />
  )
}

// ─── Leaders ─────────────────────────────────────────────────────────────────
export function LeaderPage() {
  return (
    <GenericCrudPage
      title="Leaders"
      endpoint="/api/leader/create"
      description="Company leadership profiles."
      fields={[
        { key: 'avatar',          label: 'Avatar', type: 'file' },
        { key: 'fullName_uz',     label: 'Full Name (UZ)' },
        { key: 'fullName_oz',     label: 'Full Name (OZ)' },
        { key: 'fullName_ru',     label: 'Full Name (RU)' },
        { key: 'grade_uz',        label: 'Grade / Title (UZ)' },
        { key: 'grade_oz',        label: 'Grade / Title (OZ)' },
        { key: 'grade_ru',        label: 'Grade / Title (RU)' },
        { key: 'phone',           label: 'Phone' },
        { key: 'email',           label: 'Email', type: 'email' },
        { key: 'workDays_uz',     label: 'Work Days (UZ)' },
        { key: 'workDays_oz',     label: 'Work Days (OZ)' },
        { key: 'workDays_ru',     label: 'Work Days (RU)' },
        { key: 'workHours_start', label: 'Work Hours Start' },
        { key: 'workHours_end',   label: 'Work Hours End' },
        { key: 'description_uz',  label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_oz',  label: 'Description (OZ)', type: 'textarea' },
        { key: 'description_ru',  label: 'Description (RU)', type: 'textarea' },
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
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_ru', label: 'Title (RU)' },
        { key: 'title_oz', label: 'Title (OZ)' },
        { key: 'desc_uz',  label: 'Description (UZ)', type: 'textarea' },
        { key: 'desc_ru',  label: 'Description (RU)', type: 'textarea' },
        { key: 'desc_oz',  label: 'Description (OZ)', type: 'textarea' },
        { key: 'images',   label: 'Images',            type: 'multi-file' },
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
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_ru', label: 'Title (RU)' },
        { key: 'title_oz', label: 'Title (OZ)' },
        { key: 'desc_uz',  label: 'Description (UZ)', type: 'textarea' },
        { key: 'desc_ru',  label: 'Description (RU)', type: 'textarea' },
        { key: 'desc_oz',  label: 'Description (OZ)', type: 'textarea' },
        { key: 'images',   label: 'Images',            type: 'multi-file' },
      ]}
    />
  )
}

// ─── Normative ────────────────────────────────────────────────────────────────
export function NormativePage() {
  return (
    <GenericCrudPage
      title="Normative Documents"
      endpoint="/api/normative/create"
      description="Legal and regulatory documents."
      fields={[
        { key: 'file',           label: 'File (PDF, DOC or ZIP)',   type: 'file',     required: true },
        { key: 'title_uz',       label: 'Title (UZ)',               required: true },
        { key: 'title_ru',       label: 'Title (RU)' },
        { key: 'title_oz',       label: 'Title (OZ)' },
        { key: 'decree_uz',      label: 'Decree / Order No. (UZ)', required: true },
        { key: 'decree_ru',      label: 'Decree / Order No. (RU)' },
        { key: 'decree_oz',      label: 'Decree / Order No. (OZ)' },
        { key: 'description_uz', label: 'Description (UZ)',         type: 'textarea', required: true },
        { key: 'description_ru', label: 'Description (RU)',         type: 'textarea' },
        { key: 'description_oz', label: 'Description (OZ)',         type: 'textarea' },
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
        { key: 'title_uz',     label: 'Title (UZ)' },
        { key: 'title_ru',     label: 'Title (RU)' },
        { key: 'title_oz',     label: 'Title (OZ)' },
        { key: 'employees_uz', label: 'Employees (UZ)' },
        { key: 'employees_ru', label: 'Employees (RU)' },
        { key: 'employees_oz', label: 'Employees (OZ)' },
        { key: 'leader_uz',    label: 'Leader (UZ)' },
        { key: 'leader_ru',    label: 'Leader (RU)' },
        { key: 'leader_oz',    label: 'Leader (OZ)' },
        { key: 'desc_uz',      label: 'Description (UZ)', type: 'textarea' },
        { key: 'desc_ru',      label: 'Description (RU)', type: 'textarea' },
        { key: 'desc_oz',      label: 'Description (OZ)', type: 'textarea' },
      ]}
    />
  )
}

// ─── Vacancies ────────────────────────────────────────────────────────────────
// Uses nested object format: { title: { uz, ru, oz }, ... }
export function VacanciesPage() {
  return (
    <GenericCrudPage
      title="Vacancies"
      endpoint="/api/vacancies"
      description="Job openings and recruitment listings."
      nestedLang
      fields={[
        { key: 'title',       label: 'Title',        type: 'nested-ml' },
        { key: 'description', label: 'Description',  type: 'nested-ml-textarea' },
        { key: 'salary',      label: 'Salary',       type: 'nested-ml' },
        { key: 'salaryType',  label: 'Salary Type',  type: 'nested-ml' },
        { key: 'requirements',label: 'Requirements', type: 'nested-ml-textarea' },
        { key: 'deadline',    label: 'Deadline',     type: 'date' },
      ]}
    />
  )
}

// ─── Xotin-Qizlar ─────────────────────────────────────────────────────────────
export function XotinQizlarPage() {
  return (
    <GenericCrudPage
      title="Xotin-Qizlar"
      endpoint="/api/xotinQizlar"
      description="Women's policy content and resources."
      fields={[
        { key: 'title_uz',       label: 'Title (UZ)',               required: true },
        { key: 'title_oz',       label: 'Title (OZ)' },
        { key: 'title_ru',       label: 'Title (RU)' },
        { key: 'decree_uz',      label: 'Decree (UZ)',              required: true },
        { key: 'decree_oz',      label: 'Decree (OZ)' },
        { key: 'decree_ru',      label: 'Decree (RU)' },
        { key: 'description_uz', label: 'Description (UZ)',         type: 'textarea', required: true },
        { key: 'description_oz', label: 'Description (OZ)',         type: 'textarea' },
        { key: 'description_ru', label: 'Description (RU)',         type: 'textarea' },
        { key: 'file',           label: 'File',                     type: 'file',     required: true },
      ]}
    />
  )
}

// ─── Yoshlar Siyosati ─────────────────────────────────────────────────────────
export function YoshlarPage() {
  return (
    <GenericCrudPage
      title="Yoshlar Siyosati"
      endpoint="/api/yoshlarSiyosati"
      description="Youth policy programs and initiatives."
      fields={[
        { key: 'file',           label: 'File (PDF, DOC, DOCX, XLSX or ZIP)', type: 'file', required: true },
        { key: 'title_uz',       label: 'Title (UZ)',               required: true },
        { key: 'title_ru',       label: 'Title (RU)' },
        { key: 'title_oz',       label: 'Title (OZ)' },
        { key: 'decree_uz',      label: 'Decree (UZ)',              required: true },
        { key: 'decree_ru',      label: 'Decree (RU)' },
        { key: 'decree_oz',      label: 'Decree (OZ)' },
        { key: 'description_uz', label: 'Description (UZ)',         type: 'textarea', required: true },
        { key: 'description_ru', label: 'Description (RU)',         type: 'textarea' },
        { key: 'description_oz', label: 'Description (OZ)',         type: 'textarea' },
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
        { key: 'title_uz',          label: 'Title (UZ)' },
        { key: 'title_ru',          label: 'Title (RU)' },
        { key: 'title_oz',          label: 'Title (OZ)' },
        { key: 'category_uz',       label: 'Category (UZ)' },
        { key: 'category_ru',       label: 'Category (RU)' },
        { key: 'category_oz',       label: 'Category (OZ)' },
        { key: 'description_uz',    label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_ru',    label: 'Description (RU)', type: 'textarea' },
        { key: 'description_oz',    label: 'Description (OZ)', type: 'textarea' },
        { key: 'startMonth_uz',     label: 'Start Month (UZ)' },
        { key: 'startMonth_ru',     label: 'Start Month (RU)' },
        { key: 'startMonth_oz',     label: 'Start Month (OZ)' },
        { key: 'endMonth_uz',       label: 'End Month (UZ)' },
        { key: 'endMonth_ru',       label: 'End Month (RU)' },
        { key: 'endMonth_oz',       label: 'End Month (OZ)' },
        { key: 'participantsCount', label: 'Participants Count', type: 'number' },
      ]}
    />
  )
}
