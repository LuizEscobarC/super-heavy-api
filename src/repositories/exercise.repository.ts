import { Exercise, Prisma, WorkoutExercise } from '@prisma/client';
import { prisma } from '../config/database';
import { CreateExerciseInput, UpdateExerciseInput } from '../schemas/exercise.schema';
import { NotFoundError } from '../utils/errors';

export class ExerciseRepository {
  async create(data: CreateExerciseInput): Promise<Exercise> {
    return prisma.exercise.create({
      data,
    });
  }

  async findAll(): Promise<Exercise[]> {
    return prisma.exercise.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Exercise | null> {
    return prisma.exercise.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateExerciseInput): Promise<Exercise> {
    const exercise = await this.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }
    
    return prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Exercise> {
    const exercise = await this.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }
    
    // Check if the exercise is associated with any workouts
    const workoutExerciseCount = await prisma.workoutExercise.count({
      where: { exerciseId: id },
    });
    
    if (workoutExerciseCount > 0) {
      throw new Error(`Cannot delete exercise with ID ${id} because it is associated with workouts`);
    }
    
    return prisma.exercise.delete({
      where: { id },
    });
  }

  async updateWorkoutExercises (
    workoutId: string,
    exercises: WorkoutExercise[],
  ): Promise<Prisma.BatchPayload> {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundError(`Workout with ID ${workoutId} not found`);
    }

    await prisma.workoutExercise.deleteMany({
      where: { workoutId },
    });

    return await prisma.workoutExercise.createMany({
      data: exercises
    });
  }

  async findByIdWithWorkouts(id: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        workouts: {
          include: {
            workout: true,
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }
}
