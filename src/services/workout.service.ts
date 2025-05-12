import { 
  AddExerciseToWorkoutInput, 
  CreateWorkoutInput 
} from '../schemas/workout.schema';
import { WorkoutRepository } from '../repositories/workout.repository';
import { NotFoundError } from '../utils/errors';

export class WorkoutService {
  private workoutRepository: WorkoutRepository;

  constructor() {
    this.workoutRepository = new WorkoutRepository();
  }

  async createWorkout(data: CreateWorkoutInput) {
    return this.workoutRepository.create(data);
  }

  async getAllWorkouts() {
    return this.workoutRepository.findAll();
  }

  async getWorkoutById(id: string) {
    const workout = await this.workoutRepository.findById(id);
    
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }
    
    return workout;
  }

  async getWorkoutWithExercises(id: string) {
    return this.workoutRepository.findByIdWithExercises(id);
  }

  async addExerciseToWorkout(workoutId: string, data: AddExerciseToWorkoutInput) {
    return this.workoutRepository.addExercise(workoutId, data);
  }
}
