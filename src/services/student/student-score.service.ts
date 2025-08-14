import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { ClassRoomSubject, StudentSubjectScores } from '@src/db/models';
import {
  ActivityTypeEnum,
  CreateActivityDTO,
  StudentScorePerSubjectDTO,
} from '@src/interfaces/dto/index.dto';
import gradingSystemService from '../school/grading-system.service';
import scoreFormularService from '../school/score-formular.service';
import studentService from './student.service';
import subjectService from '../school/subject.service';
import termService from '../school/term.service';
import { Transaction } from 'sequelize';
import { classSubjectService } from '../school';
import { auditService } from '../audit';
import { Request } from 'express';

class StudentScoreService extends BaseService<StudentSubjectScores> {
  constructor() {
    super(StudentSubjectScores, 'Student Subject Scores');
  }

  async bulkCreate(
    studentId: number,
    classSubjects: ClassRoomSubject[],
    transaction?: Transaction,
  ) {
    const data = classSubjects.map((subject) => {
      const { termId, subjectId } = subject;
      return { termId, subjectId, studentId };
    });

    await this.defaultModel.create(data, { transaction });
  }

  async create(data: StudentScorePerSubjectDTO, req?: Request) {
    const creationAttributes = await this.runValidations(data);

    let studentSubjectScore: StudentSubjectScores;

    await this.defaultModel.sequelize.transaction(async (transaction) => {
      studentSubjectScore = await this.defaultModel.create(creationAttributes, {
        transaction,
      });

      const auditCreationAttributeI: Partial<CreateActivityDTO> = {
        req,
        activityOn: creationAttributes.studentId,
        activityType: ActivityTypeEnum.createScore,
      };

      await auditService.createAudit(auditCreationAttributeI, transaction);
    });

    return studentSubjectScore;
  }

  async update(id: number, data: Partial<StudentScorePerSubjectDTO>, req?: Request) {
    const score = await this.getOrError({ id });

    const creationAttributes = await this.runValidations(data);

    let studentSubjectScore: StudentSubjectScores;

    await this.defaultModel.sequelize.transaction(async (transaction) => {
      await score.update(creationAttributes);

      const auditCreationAttributeI: Partial<CreateActivityDTO> = {
        req,
        activityOn: creationAttributes.studentId,
        activityType: ActivityTypeEnum.updateScore,
      };

      await auditService.createAudit(auditCreationAttributeI, transaction);
    });

    return studentSubjectScore;
  }

  private async runValidations(
    data: Partial<StudentScorePerSubjectDTO>,
  ): Promise<Partial<StudentSubjectScores>> {
    const {
      examScore: finalExamScore,
      contAssessment,
      studentId,
      subjectId,
      grade,
      total,
      termId,
    } = data;

    const score = await this.get({ studentId, subjectId, termId });

    if (score) {
      throw new BadRequestError('Student already has a score, update instead');
    }

    const [scoreSetting, gradingSystem, student] = await Promise.all([
      scoreFormularService.get({}),
      gradingSystemService.getAll({}),
      studentService.getOrError({ id: studentId }),
      subjectService.getOrError({ id: subjectId }),
    ]);

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

    const { examScore, assessmentScore } = scoreSetting;

    const { classId } = student;

    // TODO: check the term ish
    const term = await termService.getOrError({ id: termId });

    const today = new Date();

    if (today < term.startDate || today > term.endDate) {
      throw new Error('You can only enter the current term.');
    }

    const classSubject = await classSubjectService.get({ classId, termId });

    if (!classSubject) {
      throw new BadRequestError(
        'This subject you entered was not assigned for this class or this term.',
      );
    }

    const getGrade = await gradingSystemService.get({ grade });

    if (!getGrade) {
      throw new BadRequestError('You haven entered an invalid grade');
    }

    if (total > getGrade.upperRange || total < getGrade.lowerRange) {
      throw new BadRequestError('You have entered an incorrect grade.');
    }

    if (contAssessment > assessmentScore) {
      throw new BadRequestError(
        `Continuous assessment score cannot be more than ${assessmentScore}`,
      );
    }

    if (finalExamScore > examScore) {
      throw new BadRequestError(`You cannot enter an exam score higher than ${examScore}`);
    }

    return {
      examScore,
      contAssessment,
      studentId,
      subjectId,
      classId,
      termId,
      grade,
      total,
    };
  }
}

export default new StudentScoreService();
