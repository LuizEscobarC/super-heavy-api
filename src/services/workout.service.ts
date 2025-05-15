import { Workout, WorkoutExercise } from '@prisma/client';
import { 
  AddExerciseToWorkoutInput, 
  CreateWorkoutInput, 
  UpdateWorkoutInput 
} from '../schemas/workout.schema';
import { WorkoutRepository } from '../repositories/workout.repository';
import { NotFoundError } from '../utils/errors';

export class WorkoutService {
  private workoutRepository: WorkoutRepository;

  constructor() {
    this.workoutRepository = new WorkoutRepository();
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
    return this.workoutRepository.addExercise(workoutId, data);
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
        muscle: exercise.exercise.muscle,
        description: exercise.exercise.description
      },
      order: exercise.order,
      series: exercise.series,
      reps: exercise.reps,
      weight: exercise.weight,
      rest: exercise.rest
    }));
  }

}
