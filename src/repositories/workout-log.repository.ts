import { WorkoutLog, ExerciseLog, IWorkoutLog, IExerciseLog } from '../models/mongo/schemas';
import { NotFoundError } from '../utils/errors';
import { StartWorkoutInput, AddExerciseLogInput, CompleteWorkoutInput } from '../schemas/workout-log.schema';
import { prisma } from '../config/database';

export class WorkoutLogRepository {

  async startWorkout(workoutId: string, data: StartWorkoutInput): Promise<Partial<IWorkoutLog> & { exercises: Partial<IExerciseLog>[] }> {
    const workoutLog = new WorkoutLog({
      workoutId,
      startTime: new Date(),
      status: 'IN_PROGRESS',
      notes: data.notes,
    });

    const exercisesLog =  data.exercises.map((exercise) => {
      return new ExerciseLog({
        workoutLogId: workoutLog.id,
        exerciseId: exercise.exerciseId,
        workoutExerciseId: exercise.id,
        series: exercise.series.map((series) => ({
            weight: series.weight,
            reps: series.reps,
            completed: series.completed,
        })),
        notes: '',
        rest: exercise.rest || 60,
        createdAt: new Date(),
        });
    });

    await workoutLog.save();

    const exerciseLogPromises = exercisesLog.map(async (exercise) => {
      await exercise.save();
      return exercise.toObject();
    });
    const exerciseLogs = await Promise.all(exerciseLogPromises);

    return {
      ...workoutLog.toObject(),
      exercises: exerciseLogs,
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
  ): Promise<IExerciseLog> {
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

  async completeExerciseLog(logId: string, exerciseLogId: string): Promise<IExerciseLog> {
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

  async findExerciseLogs(workoutLogId: string): Promise<IExerciseLog[]> {
    return ExerciseLog.find({ workoutLogId }).sort({ createdAt: 1 });
  }
}
