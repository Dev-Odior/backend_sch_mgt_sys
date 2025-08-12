import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { StudentSubjectScores } from '@src/db/models';
import { StudentScorePerSubjectDTO } from '@src/interfaces/dto/index.dto';
import gradingSystemService from '../school/grading-system.service';
import scoreFormularService from '../school/score-formular.service';
import studentService from './student.service';
import stubjectService from '../school/subject.service';
import termService from '../school/term.service';

class StudentScoreService extends BaseService<StudentSubjectScores> {
  constructor() {
    super(StudentSubjectScores, 'Student Subject Scores');
  }

  async create(data: StudentScorePerSubjectDTO) {
    const creationAttributes = await this.runValidations(data);

    const studentSubjectScore = await this.defaultModel.create(creationAttributes);

    return studentSubjectScore;
  }

  private async runValidations(
    data: StudentScorePerSubjectDTO,
  ): Promise<Partial<StudentSubjectScores>> {
    const scoreSetting = await scoreFormularService.get({});
    const gradingSystem = await gradingSystemService.getAll({});

    if (gradingSystem.length === 0) {
      throw new BadRequestError(
        'Grading system has not been set up for your school, please contact your admin.',
      );
    }

    if (!scoreSetting) {
      throw new BadRequestError(
        'Score formular has not been set up for your school, please contact your admin.',
      );
    }

    const { numberOfAssessment, examScore, scorePerAssessment } = scoreSetting;

    const {
      assessmentScores,
      examScore: finalExamScore,
      studentId,
      subjectId,
      grade,
      total,
      termId,
    } = data;

    await studentService.getOrError({ id: studentId });
    await stubjectService.getOrError({ id: subjectId });

    // TODO: check the term ish
    const term = await termService.getOrError({ id: termId });

    const today = new Date();

    if (today < term.startDate || today > term.endDate) {
      throw new Error('You can only enter the current term.');
    }

    const getGrade = await gradingSystemService.get({ grade });

    if (total > getGrade.upperRange || total < getGrade.lowerRange) {
      throw new BadRequestError('You have entered an incorrect grade.');
    }

    if (
      assessmentScores.length < numberOfAssessment ||
      assessmentScores.length > numberOfAssessment
    ) {
      throw new BadRequestError(
        `You cannot enter lesser or more than ${numberOfAssessment} test scores`,
      );
    }

    let contAssessment: number;

    for (const assessmentScore of assessmentScores) {
      if (assessmentScore > scorePerAssessment) {
        throw new BadRequestError(
          `Each assessment score cannot be more than ${scorePerAssessment}`,
        );
      }

      contAssessment += assessmentScore;
    }

    if (finalExamScore > examScore) {
      throw new BadRequestError(`You cannot enter an exam score higher than ${examScore}`);
    }

    return {
      examScore,
      contAssessment,
      studentId,
      subjectId,
      grade,
      total,
    };
  }
}

export default new StudentScoreService();
