import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutLog extends Document {
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: Date;
}

export interface IExerciseLog {
    name: string;
    muscle?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWorkoutExerciseLog extends Document {
  workoutLogId: string;
  exercise: IExerciseLog;
  workoutExerciseId: string;
  series: IExerciseSet[];
  notes?: string;
  completed: boolean;
  completedAt?: Date;
  rest: number;
  createdAt: Date;
  updatedAt: Date;
}

const workoutLogSchema = new Schema<IWorkoutLog>(
  {
    workoutId: { type: String, required: true, index: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'CANCELED'],
      default: 'IN_PROGRESS',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const exerciseLogSchema = new Schema<IWorkoutExerciseLog>(
  {
    workoutLogId: { type: String, required: true, index: true },
    exercise: {
        name: { type: String, required: true },
        muscle: { type: String },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    workoutExerciseId: { type: String, required: true },
    series: [
      {
        weight: { type: Number, required: true },
        reps: { type: Number, required: true },
        completed: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    rest: { type: Number, default: 60 },
  },
  { timestamps: true }
);

export const WorkoutLog = mongoose.model<IWorkoutLog>('WorkoutLog', workoutLogSchema);
export const ExerciseLog = mongoose.model<IWorkoutExerciseLog>('ExerciseLog', exerciseLogSchema);
