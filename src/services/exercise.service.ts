import { CreateExerciseInput, UpdateExerciseInput } from '../schemas/exercise.schema';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { NotFoundError } from '../utils/errors';
import { WorkoutExercise } from '@prisma/client';

export class ExerciseService {
  private exerciseRepository: ExerciseRepository;

  constructor() {
    this.exerciseRepository = new ExerciseRepository();
  }

  async createExercise(data: CreateExerciseInput) {
    return this.exerciseRepository.create(data);
  }

  async getAllExercises() {
    return this.exerciseRepository.findAll();
  }

  async getExerciseById(id: string) {
    const exercise = await this.exerciseRepository.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }
    
    return exercise;
  }

  async getExerciseWithWorkouts(id: string) {
    return this.exerciseRepository.findByIdWithWorkouts(id);
  }

  async updateExercise(id: string, data: UpdateExerciseInput) {
    return this.exerciseRepository.update(id, data);
  }

  async deleteExercise(id: string) {
    return this.exerciseRepository.delete(id);
  }
}
