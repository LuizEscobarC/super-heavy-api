import { Prisma, WorkoutExercise } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { UpdateWorkoutExerciseInput } from '@/schemas/workout.schema';

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
    return prisma.workoutExercise.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.WorkoutExerciseUncheckedUpdateInput): Promise<WorkoutExercise> {
    const exercise = await this.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }
    
    return prisma.workoutExercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<WorkoutExercise> {
    const exercise = await this.findById(id);
    
    if (!exercise) {
      throw new NotFoundError(`Exercise with ID ${id} not found`);
    }
    
    const workoutExerciseCount = await prisma.workoutExercise.count({
      where: { exerciseId: id },
    });
    
    if (workoutExerciseCount > 0) {
      throw new Error(`Cannot delete exercise with ID ${id} because it is associated with workouts`);
    }
    
    return prisma.workoutExercise.delete({
      where: { id },
    });
  }

  async updateWorkoutExercises (
    workoutId: string,
    exercises: Prisma.WorkoutExerciseCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {


    await prisma.workoutExercise.deleteMany({
      where: { workoutId },
    });

    return await prisma.workoutExercise.createMany({
      data: exercises  
    });
  }
}
