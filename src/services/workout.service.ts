import { Workout, WorkoutExercise } from '@prisma/client';
import { 
  AddExerciseToWorkoutInput, 
  CreateWorkoutInput, 
  UpdateWorkoutInput 
} from '../schemas/workout.schema';
import { WorkoutRepository } from '../repositories/workout.repository';
import { NotFoundError } from '../utils/errors';
import { prisma } from '@/config/database';
import { WorkoutExerciseRepository } from '@/repositories/workout-exercise.repository';

export class WorkoutService {
  private workoutRepository: WorkoutRepository;
  private workoutExerciseRepository: WorkoutExerciseRepository;

  constructor() {
    this.workoutRepository = new WorkoutRepository();
    this.workoutExerciseRepository = new WorkoutExerciseRepository();
  }

  async createWorkout(data: CreateWorkoutInput): Promise<Workout> {
    return this.workoutRepository.create(data);
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return await this.workoutRepository.findAll();
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    return this.workoutRepository.findById(id);
  }

  async updateWorkout(id: string, data: UpdateWorkoutInput): Promise<Workout> {
    return this.workoutRepository.update(id, data);
  }

  async getWorkoutWithExercises(id: string) {
    return this.workoutRepository.findByIdWithExercises(id);
  }

  async addExerciseToWorkout(workoutId: string, data: AddExerciseToWorkoutInput) {
    const workout = await this.workoutRepository.findById(workoutId);
    
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${workoutId} not found`);
    }
    
    return await this.workoutRepository.addExercise(workoutId, data);
  }

  async getWorkoutExercises(id: string) {
    const workout = await this.workoutRepository.findByIdWithExercises(id);
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }
    
    return workout.exercises.map(exercise => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      exercise: {
        id: exercise.exercise.id,
        name: exercise.exercise.name,
        muscle: exercise.exercise?.muscle,
        description: exercise.exercise.description
      },
      order: exercise.order,
      series: exercise.series,
      reps: exercise.reps,
      weight: exercise.weight,
      rest: exercise.rest
    }));
  }

  async deleteWorkoutAndWorkoutExercises(id: string): Promise<void> {
    const workout = await this.workoutRepository.findById(id);
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }
      
    prisma.$transaction(() => Promise.all([
          this.workoutExerciseRepository.deleteWorkoutExercises(id),
          this.workoutRepository.delete(id)
    ]));
  }
}
