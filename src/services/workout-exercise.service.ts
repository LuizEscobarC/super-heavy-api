import { Prisma, WorkoutExercise } from '@prisma/client';
import { WorkoutExerciseRepository } from '../repositories/workout-exercise.repository';
import { 
  AddExerciseToWorkoutInput, 
  UpdateWorkoutExerciseInput, 
  UpdateWorkoutExercisesInput 
} from '../schemas/workout.schema';
import { WorkoutRepository } from '@/repositories/workout.repository';

export class WorkoutExerciseService {
  private repository: WorkoutExerciseRepository;
  private workoutRepository: WorkoutRepository;

  constructor() {
    this.repository = new WorkoutExerciseRepository();
    this.workoutRepository = new WorkoutRepository();
  }


  async findById(id: string): Promise<WorkoutExercise | null> {
    return this.repository.findById(id);
  }

  async addExerciseToWorkout(
    workoutId: string,
    data: AddExerciseToWorkoutInput
  ): Promise<WorkoutExercise> {
    
    const workoutExercise: Prisma.WorkoutExerciseUncheckedCreateInput = {
        ...data,
        workoutId,
        exerciseId: data.exercise.id,
    }

    return this.repository.create(workoutExercise);
  }

  async updateWorkoutExercise(
    workoutId: string,
    id: string,
    data: UpdateWorkoutExerciseInput
  ): Promise<WorkoutExercise> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout || workout?.id !== workoutId) {
      throw new Error(`Workout exercise with ID ${id} not found`);
    }

    const notNestedExercise = {
      workoutId,
      exerciseId: data.exercise.id,
      order: data.order,
      series: data.series,
      reps: data.reps,
      weight: data.weight,
      rest: data.rest
    }
  
    return this.repository.update(id, notNestedExercise);
  }

  async deleteWorkoutExercise(workoutId: string,id: string): Promise<WorkoutExercise> {
    const workoutExercise = await this.repository.findById(id);
    if (!workoutExercise) {
      throw new Error(`WorkoutExercise with ID ${id} not found`);
    }

    if (workoutExercise.workoutId !== workoutId) {
      throw new Error(`Workout exercise with ID ${id} not found`);
    }
    
    return await this.repository.delete(id);
  }

  async updateWorkoutExercises(
    workoutId: string,
    exercises: UpdateWorkoutExerciseInput[]
  ) {
    const exercisesToUpdate = exercises.map(wExercise => ({
      workoutId,
      exerciseId: wExercise.exercise.id,
      order: wExercise.order,
      series: wExercise.series,
      reps: wExercise.reps,
      weight: wExercise.weight,
      rest: wExercise.rest
    }));

    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      throw new Error(`Workout with ID ${workoutId} not found`);
    }

    return await this.repository.updateWorkoutExercises(workoutId, exercisesToUpdate);
  }
}
