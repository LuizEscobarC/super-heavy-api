import { Exercise, Workout, WorkoutExercise } from '@prisma/client';
import { prisma } from '../config/database';
import { AddExerciseToWorkoutInput, CreateWorkoutInput, UpdateWorkoutInput } from '../schemas/workout.schema';
import { NotFoundError } from '../utils/errors';

export class WorkoutRepository {
  async update(id: string, data: UpdateWorkoutInput): Promise<Workout> {
    const workout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }

    return await prisma.workout.update({
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
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Workout | null> {
    return prisma.workout.findUnique({
      where: { id },
    });
  }

  async findByIdWithExercises(id: string): Promise<Workout & { exercises: (WorkoutExercise & { exercise: Exercise })[] } | null> {
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
  ): Promise<WorkoutExercise & { exercise: Exercise } | null> {

    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: data.exercise.id },
    });

    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${data.exercise.id} not found`);
    }
    const { id } = await prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: data.exercise.id,
        order: data.order,
        series: data.series,
        reps: data.reps,
        weight: data.weight,
        rest: data.rest,
      },
    });

    return await prisma.workoutExercise.findFirst({
      where: {
        workoutId,
        id,
      },
      include: {
        exercise: true,
      },
    });
  }

  async delete(id: string): Promise<Workout> {
    return prisma.workout.delete({
      where: { id },
    });
  }
}
