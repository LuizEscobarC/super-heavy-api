import { 
  AddExerciseLogInput, 
  CompleteExerciseLogInput, 
  CompleteWorkoutInput, 
  StartWorkoutInput 
} from '../schemas/workout-log.schema';
import { WorkoutLogRepository } from '../repositories/workout-log.repository';
import { WorkoutRepository } from '../repositories/workout.repository';
import { NotFoundError } from '../utils/errors';
import { IExerciseLog, IExerciseSet, IWorkoutLog } from '@/models/mongo/schemas';

export class WorkoutLogService {
  private workoutLogRepository: WorkoutLogRepository;
  private workoutRepository: WorkoutRepository;

  constructor() {
    this.workoutLogRepository = new WorkoutLogRepository();
    this.workoutRepository = new WorkoutRepository();
  }

  async startWorkout(workoutId: string, data: StartWorkoutInput) {
    const workout = await this.workoutRepository.findById(workoutId);

    if (await this.workoutLogRepository.isWorkoutInProgress(workoutId)) {
      return await this.workoutLogRepository.getWorkoutLogByWorkoutId(workoutId);
    }
    
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${workoutId} not found`);
    }
    const response = await this.workoutLogRepository.startWorkout(workoutId, data);
    
    return  response;
  }

  async workoutInProgress(workoutId: string) {
    const workout = await this.workoutRepository.findById(workoutId);
    
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${workoutId} not found`);
    }
    
    return await this.workoutLogRepository.workoutInProgress(workoutId);
  }

  async completeWorkout(workoutId: string, logId: string, data: CompleteWorkoutInput) {
    // Verify workout exists
    await this.workoutRepository.findById(workoutId);
    
    return this.workoutLogRepository.completeWorkout(logId, data);
  }

  async getWorkoutLogs(workoutId?: string, limit?: number, page?: number) {
    return this.workoutLogRepository.findAllLogs(workoutId, limit, page);
  }

  async getWorkoutLogById(logId: string) {
    const log = await this.workoutLogRepository.findById(logId);
    
    if (!log) {
      throw new NotFoundError(`Workout log with ID ${logId} not found`);
    }
    
    return log;
  }

  async addExerciseLog(workoutId: string, logId: string, data: AddExerciseLogInput) {
    // Verify workout exists
    await this.workoutRepository.findById(workoutId);
    
    return this.workoutLogRepository.addExerciseLog(logId, data);
  }

  async completeExerciseLog(
    workoutId: string, 
    logId: string, 
    exerciseLogId: string, 
    data: CompleteExerciseLogInput
  ) {
    // Verify workout exists
    await this.workoutRepository.findById(workoutId);
    
    return this.workoutLogRepository.completeExerciseLog(logId, exerciseLogId);
  }

  async getExerciseLogs(workoutId: string, logId: string) {
    // Verify workout exists
    await this.workoutRepository.findById(workoutId);
    
    return this.workoutLogRepository.findExerciseLogs(logId);
  }
}
