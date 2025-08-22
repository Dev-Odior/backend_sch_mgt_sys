import { StudentSubjectScores } from '@src/db/models';

import { BadRequestError } from '@src/errors/indeex';

import { studentService, studentScoreService } from '.';
import classSubjectService from '../school/class-subject.service';
import { GenerateReportDTO } from '@src/interfaces/dto/index.dto';
import { termService } from '../school';

interface StudentAverage {
  studentId: number;
  average: number;
}

class ReportService {
  async generate({ studentId, classId, termId }: GenerateReportDTO) {
    const student = await studentService.getOrError({ id: studentId }, studentService.includeables);

    const sessionInfo = await termService.getOrError({ id: termId }, termService.includeables);

    const totalClassmates = await studentService.count({ classId: student.classId });

    const studentScores = await studentScoreService.getAll(
      { studentId, classId, termId },
      studentScoreService.includeables,
    );

    if (studentScores.length === 0) {
      throw new BadRequestError('Student has no score for this class or term');
    }

    const allStudentScores = await studentScoreService.getAll(
      { classId, termId },
      studentScoreService.includeables,
    );

    const classSubjects = await classSubjectService.getAll({ classId, termId });

    if (classSubjects.length === 0) {
      throw new BadRequestError('No subject was set up for this class or this term');
    }

    if (studentScores.length !== classSubjects.length) {
      throw new BadRequestError(
        `You have not entered all the scores for the ${student.firstName} ${student.surname}`,
      );
    }

    const totalObtainable = classSubjects.length * 100;

    const totalScore = await studentScoreService.sum('total', { studentId, classId, termId });

    const studentAveragePercent = (totalScore / totalObtainable) * 100;

    const finalScores = this.analyzeStudentPerformance(studentScores, allStudentScores);

    const averagesAndPosition = await this.getClassAverageAndStudentPosition(
      classId,
      termId,
      student.id,
    );

    return {
      student,
      sessionInfo,
      academics: finalScores,
      totalObtainable,
      totalClassmates,
      totalScore,
      totalSubject: classSubjects.length,
      studentAveragePercent,
      ...averagesAndPosition,
    };
  }

  private analyzeStudentPerformance(
    studentScores: StudentSubjectScores[],
    allStudentScores: StudentSubjectScores[],
  ) {
    return studentScores.map((studentScore) => {
      const subjectId = studentScore.subjectId;

      console.log(studentScore);

      const subject = studentScore?.subject.name;

      const subjectScores = allStudentScores.filter((s) => s.subjectId === subjectId);

      const sortedScores = [...subjectScores].sort((a, b) => b.total - a.total);

      const position = sortedScores.findIndex((s) => s.studentId === studentScore.studentId) + 1;

      const highestScore = sortedScores[0]?.total ?? 0;
      const lowestScore = sortedScores[sortedScores.length - 1]?.total ?? 0;
      const averageScore =
        subjectScores.reduce((sum, s) => sum + s.total, 0) / subjectScores.length;

      return {
        subject,
        studentScore: studentScore.total,
        ca: studentScore.contAssessment,
        exam: studentScore.examScore,
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
