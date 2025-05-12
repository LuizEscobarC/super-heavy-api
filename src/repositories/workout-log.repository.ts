import { WorkoutLog, ExerciseLog, IWorkoutLog, IExerciseLog } from '../models/mongo/schemas';
import { NotFoundError } from '../utils/errors';
import { StartWorkoutInput, AddExerciseLogInput, CompleteWorkoutInput } from '../schemas/workout-log.schema';

export class WorkoutLogRepository {
  async startWorkout(workoutId: string, data: StartWorkoutInput): Promise<IWorkoutLog> {
    const workoutLog = new WorkoutLog({
      workoutId,
      startTime: new Date(),
      status: 'IN_PROGRESS',
      notes: data.notes,
    });

    return workoutLog.save();
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

    const exerciseLog = new ExerciseLog({
      workoutLogId,
      exerciseId: data.exerciseId,
      workoutExerciseId: data.workoutExerciseId,
      sets: data.sets,
      notes: data.notes,
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
