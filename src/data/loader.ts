import type {
  Profile,
  Skills,
  Projects,
  Experiences,
  Certifications,
  LicensesCertifications,
  Honors,
  Volunteerings,
  AdditionalInfos,
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
  experiences: Experiences;
  certifications: Certifications;
  licensesCertifications: LicensesCertifications;
  honors: Honors;
  volunteering: Volunteerings;
  additionalInfo: AdditionalInfos;
}

export const gameData: GameData = {
  profile: profileRaw as Profile,
  skills: skillsRaw as Skills,
  projects: projectsRaw as Projects,
  experiences: experiencesRaw as Experiences,
  certifications: certificationsRaw as Certifications,
  licensesCertifications: licensesCertificationsRaw as LicensesCertifications,
  honors: honorsRaw as Honors,
  volunteering: volunteeringRaw as Volunteerings,
  additionalInfo: additionalInfoRaw as AdditionalInfos,
};
