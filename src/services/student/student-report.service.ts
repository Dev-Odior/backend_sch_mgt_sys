import { StudentSubjectScores } from '@src/db/models';

import { BadRequestError } from '@src/errors/indeex';

import { studentService, studentScoreService } from '.';
import classSubjectService from '../school/class-subject.service';
import schoolService from '../school/school.service';
import { GenerateReportDTO } from '@src/interfaces/dto/index.dto';

interface StudentAverage {
  studentId: number;
  average: number;
}

class ReportService {
  async generate({ studentId, classId, termId }: GenerateReportDTO) {
    const student = await studentService.getOrError({ id: studentId });

    const studentScores = await studentScoreService.getAll({ id: studentId, classId, termId });

    if (!studentScores) {
      throw new BadRequestError('Student has no score for this class or term');
    }

    const allStudentScores = await studentScoreService.getAll({ classId, termId });

    const classSubjects = await classSubjectService.getAll({ id: classId, termId });

    if (classSubjects.length === 0) {
      throw new BadRequestError('No subject was set up for this class or this term');
    }

    if (studentScores.length !== classSubjects.length) {
      throw new BadRequestError(
        `You have not entered all the scores for the ${student.firstName} ${student.surname}`,
      );
    }

    const totalObtainable = classSubjects.length * 100;

    const totalScore = await studentScoreService.sum('total', { id: studentId, classId, termId });

    const studentAveragePercent = (totalScore / totalObtainable) * 100;

    const finalScores = this.analyzeStudentPerformance(studentScores, allStudentScores);

    const averagesAndPosition = await this.getClassAverageAndStudentPosition(
      classId,
      termId,
      student.id,
    );
    const schoolInfo = await schoolService.get({});

    return {
      schoolInfo,
      student,
      academics: finalScores,
      analytics: {
        totalObtainable,
        totalScore,
        studentAveragePercent,
        ...averagesAndPosition,
      },
    };
  }

  private analyzeStudentPerformance(
    studentScores: StudentSubjectScores[],
    allStudentScores: StudentSubjectScores[],
  ) {
    return studentScores.map((studentScore) => {
      const subjectId = studentScore.subjectId;

      const subjectScores = allStudentScores.filter((s) => s.subjectId === subjectId);

      const sortedScores = [...subjectScores].sort((a, b) => b.total - a.total);

      const position = sortedScores.findIndex((s) => s.studentId === studentScore.studentId) + 1;

      const highestScore = sortedScores[0]?.total ?? 0;
      const lowestScore = sortedScores[sortedScores.length - 1]?.total ?? 0;
      const averageScore =
        subjectScores.reduce((sum, s) => sum + s.total, 0) / subjectScores.length;

      return {
        subjectId,
        studentScore: studentScore.total,
        contAssessment: studentScore.contAssessment,
        examScore: studentScore.examScore,
        grade: studentScore.grade,
        highestScore,
        lowestScore,
        averageScore: parseFloat(averageScore.toFixed(2)),
        position,
      };
    });
  }

  private async getClassAverageAndStudentPosition(
    classId: number,
    termId: number,
    studentId: number,
  ) {
    const allScores: StudentSubjectScores[] = await studentScoreService.getAll({ classId, termId });

    if (!allScores.length) {
      throw new Error('No scores found for the given class and term');
    }

    const scoresByStudent: Record<number, number[]> = {};
    for (const score of allScores) {
      if (!scoresByStudent[score.studentId]) {
        scoresByStudent[score.studentId] = [];
      }
      scoresByStudent[score.studentId].push(score.total);
    }

    const studentAverages: StudentAverage[] = Object.entries(scoresByStudent).map(
      ([id, totals]) => {
        const avg = totals.reduce((sum, t) => sum + t, 0) / totals.length;
        return {
          studentId: Number(id),
          average: avg,
        };
      },
    );

    const classAverage =
      studentAverages.reduce((sum, s) => sum + s.average, 0) / studentAverages.length;

    const ranked = [...studentAverages].sort((a, b) => b.average - a.average);

    const position = ranked.findIndex((s) => s.studentId === studentId) + 1;

    const targetAverage = studentAverages.find((s) => s.studentId === studentId)?.average ?? 0;

    return {
      classAverage: parseFloat(classAverage.toFixed(2)),
      studentAverage: parseFloat(targetAverage.toFixed(2)),
      studentPosition: position,
    };
  }
}

export default new ReportService();
