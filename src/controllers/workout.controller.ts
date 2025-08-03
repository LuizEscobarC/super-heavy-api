import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutService } from '../services/workout.service';
import { 
  AddExerciseToWorkoutInput, 
  CreateWorkoutInput,
  UpdateWorkoutExerciseInput,
  UpdateWorkoutExercisesInput
} from '../schemas/workout.schema';
import { WorkoutExerciseService } from '@/services/workout-exercise.service';

export class WorkoutController {
  private workoutService: WorkoutService;
  private workoutExerciseService: WorkoutExerciseService;

  constructor() {
    this.workoutService = new WorkoutService();
    this.workoutExerciseService = new WorkoutExerciseService();
  }

  async updateWorkout(
    request: FastifyRequest<{ Params: { id: string }, Body: CreateWorkoutInput }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const workout = await this.workoutService.getWorkoutById(id);
    
    if (!workout) {
      return reply.status(404).send({ message: 'Workout not found' });
    }
    
    const updatedWorkout = await this.workoutService.updateWorkout(id, request.body);
    
    return reply.status(200).send(updatedWorkout);
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

  async updateWorkoutExercises(
    request: FastifyRequest<{
      Params: { id: string },
      Body: {exercises: UpdateWorkoutExerciseInput[]}
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { exercises } = request.body;

    const updatedExercises = await this.workoutExerciseService.updateWorkoutExercises(id, exercises);

    return reply.status(200).send(updatedExercises);
  }

  async deleteWorkout(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    await this.workoutService.deleteWorkoutAndWorkoutExercises(id);
    
    return reply.status(204).send();
  }

  async deleteWorkoutExercise(
    request: FastifyRequest<{ Params: { workoutId: string, id: string } }>,
    reply: FastifyReply
  ) {
    const { workoutId, id } = request.params;
    
    await this.workoutExerciseService.deleteWorkoutExercise(workoutId, id);
    
    return reply.status(204).send();
  }

  async updateWorkoutExercise(
    request: FastifyRequest<{ 
      Params: { workoutId: string, id: string }, 
      Body: UpdateWorkoutExerciseInput 
    }>,
    reply: FastifyReply
  ) {
    const { workoutId, id } = request.params;
    const updatedExercise = await this.workoutExerciseService.updateWorkoutExercise(workoutId, id, request.body);
    
    return reply.status(200).send(updatedExercise);
  }
}