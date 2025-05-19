import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutLogService } from '../services/workout-log.service';
import { 
  AddExerciseLogInput, 
  CompleteExerciseLogInput, 
  CompleteWorkoutInput, 
  StartWorkoutInput
} from '../schemas/workout-log.schema';

export class WorkoutLogController {
  private workoutLogService: WorkoutLogService;

  constructor() {
    this.workoutLogService = new WorkoutLogService();
  }

  async startWorkout(
    request: FastifyRequest<{ 
      Params: { id: string }, 
      Body: StartWorkoutInput 
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const workoutLog = await this.workoutLogService.startWorkout(id, request.body);
    return reply.status(201).send(workoutLog);
  }

  async getWorkoutInProgress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    let workoutInProgress = await this.workoutLogService.workoutInProgress(id);
    
    return reply.send(workoutInProgress);
  }

  async completeWorkout(
    request: FastifyRequest<{ 
      Params: { id: string; logId: string }, 
      Body: CompleteWorkoutInput 
    }>,
    reply: FastifyReply
  ) {
    const { id, logId } = request.params;
    const workoutLog = await this.workoutLogService.completeWorkout(id, logId, request.body);
    
    return reply.send(workoutLog);
  }

  async getWorkoutLogs(
    request: FastifyRequest<{ 
      Querystring: { 
        workoutId?: string;
        limit?: number;
        page?: number;
      } 
    }>,
    reply: FastifyReply
  ) {
    const { workoutId, limit, page } = request.query;
    
    const logs = await this.workoutLogService.getWorkoutLogs(workoutId, limit, page);
    
    return reply.send(logs);
  }

  async addExerciseLog(
    request: FastifyRequest<{ 
      Params: { id: string; logId: string }, 
      Body: AddExerciseLogInput 
    }>,
    reply: FastifyReply
  ) {
    const { id, logId } = request.params;
    const exerciseLog = await this.workoutLogService.addExerciseLog(id, logId, request.body);
    
    return reply.status(201).send(exerciseLog);
  }

  async completeExerciseLog(
    request: FastifyRequest<{ 
      Params: { id: string; logId: string; exerciseLogId: string }, 
      Body: CompleteExerciseLogInput 
    }>,
    reply: FastifyReply
  ) {
    const { id, logId, exerciseLogId } = request.params;
    const exerciseLog = await this.workoutLogService.completeExerciseLog(
      id, 
      logId, 
      exerciseLogId, 
      request.body
    );
    
    return reply.send(exerciseLog);
  }

  async getExerciseLogs(
    request: FastifyRequest<{ Params: { id: string; logId: string } }>,
    reply: FastifyReply
  ) {
    const { id, logId } = request.params;
    
    const exerciseLogs = await this.workoutLogService.getExerciseLogs(id, logId);
    
    return reply.send(exerciseLogs);
  }
}
