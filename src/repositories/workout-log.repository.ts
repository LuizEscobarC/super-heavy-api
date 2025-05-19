import { WorkoutLog, ExerciseLog, IWorkoutLog, IWorkoutExerciseLog } from '../models/mongo/schemas';
import { NotFoundError } from '../utils/errors';
import { StartWorkoutInput, AddExerciseLogInput, CompleteWorkoutInput } from '../schemas/workout-log.schema';
import { prisma } from '../config/database';

export class WorkoutLogRepository {

  async startWorkout(workoutId: string, data: StartWorkoutInput): Promise<Partial<IWorkoutLog> & { exercises: Partial<IWorkoutExerciseLog>[] }> {
    const workoutLog = await new WorkoutLog({
      workoutId,
      startTime: new Date(),
      status: 'IN_PROGRESS',
      notes: data.notes,
    }).save();

    const exerciseIds = [...new Set(data.exercises.map(e => e.exerciseId))];
    const exercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
      }
    });

    const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
    
    // NO N+1
    const exercisesLog =  data.exercises.map((exercise) => ({
        workoutLogId: workoutLog.id,
        workoutExerciseId: exercise.id,
        exercise: exerciseMap.get(exercise.exerciseId),
        series: exercise.series.map((series) => ({
            weight: series.weight,
            reps: series.reps,
            completed: series.completed,
        })),
        notes: '',
        rest: exercise.rest || 60,
        createdAt: new Date(),
    }));


    const exerciseLogs = await ExerciseLog.insertMany(exercisesLog);
    const workoutLogToObj = workoutLog.toObject();
    return {
      ...workoutLogToObj,
      _id: workoutLogToObj.id.toString(),
      exercises: exerciseLogs.map((exerciseLog) => exerciseLog.toObject()),
    }
  }

  async completeWorkout(logId: string, data: CompleteWorkoutInput): Promise<IWorkoutLog> {
    const workoutLog = await WorkoutLog.findById(logId);
    
    if (!workoutLog) {
      throw new NotFoundError(`Workout log with ID ${logId} not found`);
    }

    workoutLog.endTime = new Date();
    workoutLog.status = 'COMPLETED';
    if (data.notes) workoutLog.notes = data.notes;

    return workoutLog.save();
  }

  async cancelWorkout(logId: string): Promise<IWorkoutLog> {
    const workoutLog = await WorkoutLog.findById(logId);
    
    if (!workoutLog) {
      throw new NotFoundError(`Workout log with ID ${logId} not found`);
    }

    workoutLog.endTime = new Date();
    workoutLog.status = 'CANCELED';

    return workoutLog.save();
  }

  async findById(logId: string): Promise<IWorkoutLog | null> {
    return WorkoutLog.findById(logId);
  }

  async isWorkoutInProgress(workoutId: string): Promise<boolean> {
    const workoutLog = await WorkoutLog.findOne({ workoutId, status: 'IN_PROGRESS' });
    return !!workoutLog;
  }

  async workoutInProgress(workoutId: string) {
    const workoutLog = await WorkoutLog.findOne({ workoutId, status: 'IN_PROGRESS' });
    if (!workoutLog) {
      return null;
    }
    const exerciseLogs = await ExerciseLog.find({ workoutLogId: workoutLog._id });
    return {
      ...workoutLog.toObject(),
      exercises: exerciseLogs.map((exerciseLog) => exerciseLog.toObject()),
    }
  }

  async getWorkoutLogByWorkoutId(workoutId: string): Promise<Partial<IWorkoutLog> & { exercises: Partial<IWorkoutExerciseLog>[] }> {
    const workoutLog = await WorkoutLog.findOne({ workoutId, status: 'IN_PROGRESS' });

    if (!workoutLog) {
      throw new NotFoundError(`Workout log with ID ${workoutId} not found`);
    }

   const exerciseLogs =  await ExerciseLog.find({ workoutLogId: workoutLog._id })

   return {
      ...workoutLog.toObject(),
      exercises: exerciseLogs.map((exerciseLog) => exerciseLog.toObject()),
   }
  }

  async findAllLogs(workoutId?: string, limit = 20, page = 1): Promise<IWorkoutLog[]> {
    const query = workoutId ? { workoutId } : {};
    const skip = (page - 1) * limit;
    
    return WorkoutLog.find(query)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);
  }

  async addExerciseLog(
    workoutLogId: string,
    data: AddExerciseLogInput
  ): Promise<IWorkoutExerciseLog> {
    const workoutLog = await WorkoutLog.findById(workoutLogId);
    
    if (!workoutLog) {
      throw new NotFoundError(`Workout log with ID ${workoutLogId} not found`);
    }

    if (workoutLog.status !== 'IN_PROGRESS') {
      throw new Error('Cannot add exercises to a completed or canceled workout');
    }

    // Get the rest value from the workout exercise if not provided
    let restPeriod = data.rest;
    if (!restPeriod) {
      const workoutExercise = await prisma.workoutExercise.findUnique({
        where: { id: data.workoutExerciseId }
      });
      
      if (workoutExercise) {
        restPeriod = workoutExercise.rest;
      } else {
        restPeriod = 60;
      }
    }

    const exerciseLog = new ExerciseLog({
      workoutLogId,
      exerciseId: data.exerciseId,
      workoutExerciseId: data.workoutExerciseId,
      series: data.series,
      notes: data.notes,
      rest: restPeriod
    });

    return exerciseLog.save();
  }

  async completeExerciseLog(logId: string, exerciseLogId: string): Promise<IWorkoutExerciseLog> {
    const exerciseLog = await ExerciseLog.findOne({ 
      _id: exerciseLogId,
      workoutLogId: logId
    });
    
    if (!exerciseLog) {
      throw new NotFoundError(`Exercise log with ID ${exerciseLogId} not found`);
    }

    exerciseLog.completed = true;
    exerciseLog.completedAt = new Date();

    return exerciseLog.save();
  }

  async findExerciseLogs(workoutLogId: string): Promise<IWorkoutExerciseLog[]> {
    return ExerciseLog.find({ workoutLogId }).sort({ createdAt: 1 });
  }
}
