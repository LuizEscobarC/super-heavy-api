import { Prisma, WorkoutExercise } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class WorkoutExerciseRepository {
  async create(data: Prisma.WorkoutExerciseUncheckedCreateInput): Promise<WorkoutExercise> {
    return prisma.workoutExercise.create({
      data,
    });
  }

  async findAll(): Promise<WorkoutExercise[]> {
    return prisma.workoutExercise.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: string): Promise<WorkoutExercise | null> {
    return await prisma.workoutExercise.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.WorkoutExerciseUncheckedUpdateInput): Promise<WorkoutExercise> {
    const exercise = await this.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }

    return await prisma.workoutExercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<WorkoutExercise> {
    return await prisma.workoutExercise.delete({
      where: { id },
    });
  }

  async updateWorkoutExercises (
    workoutId: string,
    exercises: Prisma.WorkoutExerciseCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    await prisma.workoutExercise.deleteMany({
      where: { 
        workoutId
      },
    });

    return await prisma.workoutExercise.createMany({
      data: exercises  
    });
  }

  async deleteWorkoutExercises(workoutId: string): Promise<Prisma.BatchPayload> {
    return await prisma.workoutExercise.deleteMany({
      where: { workoutId },
    });
  }
}
