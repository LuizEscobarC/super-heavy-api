import { Workout, WorkoutExercise } from '@prisma/client';
import { prisma } from '../config/database';
import { AddExerciseToWorkoutInput, CreateWorkoutInput } from '../schemas/workout.schema';
import { NotFoundError } from '../utils/errors';

export class WorkoutRepository {
  async update(id: string, data: CreateWorkoutInput): Promise<Workout> {
    const workout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }

    return prisma.workout.update({
      where: { id },
      data,
    });
  }

  async create(data: CreateWorkoutInput): Promise<Workout> {
    return prisma.workout.create({
      data,
    });
  }

  async findAll(): Promise<Workout[]> {
    return prisma.workout.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Workout | null> {
    return prisma.workout.findUnique({
      where: { id },
    });
  }

  async findByIdWithExercises(id: string) {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }

    return workout;
  }

  async addExercise(
    workoutId: string,
    data: AddExerciseToWorkoutInput
  ): Promise<WorkoutExercise> {
    const workout = await this.findById(workoutId);
    
    if (!workout) {
      throw new NotFoundError(`Workout with ID ${workoutId} not found`);
    }

    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: data.exerciseId },
    });

    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${data.exerciseId} not found`);
    }

    return prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: data.exerciseId,
        order: data.order,
        series: data.series,
        reps: data.reps,
        weight: data.weight,
        rest: data.rest,
      },
    });
  }
}
