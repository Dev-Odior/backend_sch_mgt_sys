import { CreateFormulaDTO, SchoolCreationDTO } from '@src/interfaces/dto/index.dto';
import {
  academicSessionService,
  schoolService,
  termService,
  scoreFormularService,
} from '../school';

import { AcademicSession, Term, School, ScoreFormula } from '@src/db/models';

class OnboardingService {
  async createSchool(data: SchoolCreationDTO) {
    const {
      schoolName,
      schoolAddress,
      email,
      contactNumber,
      academicSessionName,
      numberOfTerms,
      termStartDate,
      termEndDate,
      logoUrl,
    } = data;

    const academicSessionAttributeI: Partial<AcademicSession> = {
      name: academicSessionName,
      numberOfTerms,
      isCurrent: true,
    };

    const SchoolAttributeI: Partial<School> = {
      name: schoolName,
      email,
      contact: contactNumber,
      address: schoolAddress,
      logoUrl,
    };

    await schoolService.create(SchoolAttributeI);

    const session = await academicSessionService.create(academicSessionAttributeI);

    const termAttributeI: Partial<Term> = {
      name: `${academicSessionName} - First Term`,
      academicSessionId: session.id,
      startDate: termStartDate,
      endDate: termEndDate,
    };

    await termService.create(termAttributeI);
  }

  async createFormula(data: CreateFormulaDTO) {
    const formulaAttributeI: Partial<ScoreFormula> = { ...data };

    await scoreFormularService.create(formulaAttributeI);
  }
}

export default new OnboardingService();
