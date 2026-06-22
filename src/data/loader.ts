import { z } from 'zod';
import {
  ProfileSchema,
  SkillsSchema,
  ProjectsSchema,
  ExperienceSchema,
  CertificationSchema,
  LicensesCertificationsSchema,
  HonorSchema,
  VolunteeringSchema,
  AdditionalInfoSchema,
} from '../types/data';

import type {
  Profile,
  Skills,
  Projects,
  LicensesCertifications,
  AdditionalInfo,
} from '../types/data';

import profileRaw from '../../data/profile.json';
import skillsRaw from '../../data/skills.json';
import projectsRaw from '../../data/projects.json';
import experiencesRaw from '../../data/experience.json';
import certificationsRaw from '../../data/certifications.json';
import licensesCertificationsRaw from '../../data/licenses_certifications.json';
import honorsRaw from '../../data/honors.json';
import volunteeringRaw from '../../data/volunteering.json';
import additionalInfoRaw from '../../data/additional_info.json';

export interface GameData {
  profile: Profile;
  skills: Skills;
  projects: Projects;
  experiences: Array<z.infer<typeof ExperienceSchema>>;
  certifications: Array<z.infer<typeof CertificationSchema>>;
  licensesCertifications: LicensesCertifications;
  honors: Array<z.infer<typeof HonorSchema>>;
  volunteering: Array<z.infer<typeof VolunteeringSchema>>;
  additionalInfo: AdditionalInfo;
}

function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Data Loader] Validation failed for ${label}:`, result.error.issues);
    throw new Error(`Data validation error: ${label}`);
  }
  return result.data;
}

export const gameData: GameData = {
  profile: validateOrThrow(ProfileSchema, profileRaw, 'profile'),
  skills: validateOrThrow(SkillsSchema, skillsRaw, 'skills'),
  projects: validateOrThrow(ProjectsSchema, projectsRaw, 'projects'),
  experiences: Array.isArray(experiencesRaw)
    ? experiencesRaw.map((item) => validateOrThrow(ExperienceSchema, item, 'experience'))
    : [],
  certifications: Array.isArray(certificationsRaw)
    ? certificationsRaw.map((item) => validateOrThrow(CertificationSchema, item, 'certification'))
    : [],
  licensesCertifications: validateOrThrow(LicensesCertificationsSchema, licensesCertificationsRaw, 'licenses_certifications'),
  honors: Array.isArray(honorsRaw)
    ? honorsRaw.map((item) => validateOrThrow(HonorSchema, item, 'honor'))
    : [],
  volunteering: Array.isArray(volunteeringRaw)
    ? volunteeringRaw.map((item) => validateOrThrow(VolunteeringSchema, item, 'volunteering'))
    : [],
  additionalInfo: validateOrThrow(AdditionalInfoSchema, additionalInfoRaw, 'additional_info'),
};
