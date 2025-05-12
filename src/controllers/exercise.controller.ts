import { FastifyRequest, FastifyReply } from 'fastify';
import { ExerciseService } from '../services/exercise.service';
import { 
  CreateExerciseInput,
  UpdateExerciseInput
} from '../schemas/exercise.schema';

export class ExerciseController {
  private exerciseService: ExerciseService;

  constructor() {
    this.exerciseService = new ExerciseService();
  }

  async createExercise(
    request: FastifyRequest<{ Body: CreateExerciseInput }>,
    reply: FastifyReply
  ) {
    const exercise = await this.exerciseService.createExercise(request.body);
    
    return reply.status(201).send(exercise);
  }

  async getAllExercises(request: FastifyRequest, reply: FastifyReply) {
    const exercises = await this.exerciseService.getAllExercises();
    
    return reply.send(exercises);
  }

  async getExerciseById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const exercise = await this.exerciseService.getExerciseById(id);
    
    return reply.send(exercise);
  }

  async getExerciseWithWorkouts(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const exercise = await this.exerciseService.getExerciseWithWorkouts(id);
    
    return reply.send(exercise);
  }

  async updateExercise(
    request: FastifyRequest<{ 
      Params: { id: string }, 
      Body: UpdateExerciseInput 
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const exercise = await this.exerciseService.updateExercise(id, request.body);
    
    return reply.send(exercise);
  }

  async deleteExercise(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const exercise = await this.exerciseService.deleteExercise(id);
    
    return reply.status(204).send();
  }
}
