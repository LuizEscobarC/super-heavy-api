import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutService } from '../services/workout.service';
import { 
  AddExerciseToWorkoutInput, 
  CreateWorkoutInput
} from '../schemas/workout.schema';

export class WorkoutController {
  private workoutService: WorkoutService;

  constructor() {
    this.workoutService = new WorkoutService();
  }

  async createWorkout(
    request: FastifyRequest<{ Body: CreateWorkoutInput }>,
    reply: FastifyReply
  ) {
    const workout = await this.workoutService.createWorkout(request.body);
    
    return reply.status(201).send(workout);
  }

  async getAllWorkouts(request: FastifyRequest, reply: FastifyReply) {
    const workouts = await this.workoutService.getAllWorkouts();
    
    return reply.send(workouts);
  }

  async getWorkoutById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const workout = await this.workoutService.getWorkoutWithExercises(id);
    
    return reply.send(workout);
  }

  async addExerciseToWorkout(
    request: FastifyRequest<{ 
      Params: { id: string }, 
      Body: AddExerciseToWorkoutInput 
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const workoutExercise = await this.workoutService.addExerciseToWorkout(id, request.body);
    
    return reply.status(201).send(workoutExercise);
  }

  async getWorkoutExercises(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const exercises = await this.workoutService.getWorkoutExercises(id);
    
    return reply.send(exercises);
  }
}
