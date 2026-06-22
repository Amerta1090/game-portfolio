import { z } from 'zod';

export const ContactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  linkedin: z.string().url(),
  github: z.string().url(),
  website: z.string().nullable(),
});

export const MetricsSchema = z.object({
  years_experience: z.number(),
  projects_shipped: z.number(),
  certifications: z.number(),
  languages: z.array(z.string()),
});

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  tagline: z.string(),
  location: z.string(),
  timezone: z.string(),
  contact: ContactSchema,
  summary: z.string(),
  metrics: MetricsSchema,
  resume_url: z.string(),
});

export const SkillSchema = z.object({
  name: z.string(),
  proficiency: z.number().min(1).max(5),
});

export const SkillCategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
  skills: z.array(SkillSchema),
});

export const SkillsSchema = z.object({
  categories: z.array(SkillCategorySchema),
});

export const ProjectLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const ProjectSchema = z.object({
  title: z.string(),
  featured: z.boolean().optional().default(false),
  category: z.string(),
  period: z.string(),
  description: z.string(),
  links: z.array(ProjectLinkSchema),
  skills: z.array(z.string()),
  association: z.string().optional(),
  media: z.array(z.string()).optional(),
});

export const ProjectsSchema = z.object({
  projects: z.array(ProjectSchema),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  type: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  location: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
  url: z.string().nullable(),
});

export const CertificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  date: z.string().nullable(),
  credential_id: z.string().nullable(),
  skills: z.array(z.string()),
  url: z.string().nullable(),
});

export const LicenseCertificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  issue_date: z.string().nullable(),
  expiration_date: z.string().nullable(),
  credential_id: z.string().nullable(),
  skills: z.array(z.string()),
});

export const LicensesCertificationsSchema = z.object({
  licenses_and_certifications: z.array(LicenseCertificationSchema),
});

export const HonorSchema = z.object({
  title: z.string(),
  event: z.string(),
  date: z.string(),
  category: z.string(),
  description: z.string().nullable(),
});

export const VolunteeringSchema = z.object({
  role: z.string(),
  organization: z.string(),
  cause: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  highlights: z.array(z.string()),
});

export const LanguageInfoSchema = z.object({
  language: z.string(),
  proficiency: z.string(),
  additional_info: z.string().nullable(),
});

export const VolunteeringEntrySchema = z.object({
  role: z.string(),
  organization: z.string(),
  duration: z.string(),
  cause: z.string(),
  description: z.string(),
});

export const ContactLinksSchema = z.object({
  linkedin: z.string().url(),
});

export const AdditionalInfoSchema = z.object({
  languages: z.array(LanguageInfoSchema),
  volunteering: z.array(VolunteeringEntrySchema),
  contact_links: ContactLinksSchema,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Projects = z.infer<typeof ProjectsSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type LicenseCertification = z.infer<typeof LicenseCertificationSchema>;
export type LicensesCertifications = z.infer<typeof LicensesCertificationsSchema>;
export type Honor = z.infer<typeof HonorSchema>;
export type Volunteering = z.infer<typeof VolunteeringSchema>;
export type AdditionalInfo = z.infer<typeof AdditionalInfoSchema>;
