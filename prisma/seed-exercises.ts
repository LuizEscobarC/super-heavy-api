import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exercisesData = [
    { name: 'Bench Press', muscle: 'Chest', description: 'Barbell press lying on a bench' },
    { name: 'Squat', muscle: 'Legs', description: 'Barbell squat' },
    { name: 'Deadlift', muscle: 'Back', description: 'Barbell deadlift' },
    { name: 'Shoulder Press', muscle: 'Shoulders', description: 'Barbell or dumbbell press overhead' },
    { name: 'Pull-up', muscle: 'Back', description: 'Body weight pull-up' },
    { name: 'Bicep Curl', muscle: 'Arms', description: 'Dumbbell or barbell bicep curl' },
    { name: 'Tricep Extension', muscle: 'Arms', description: 'Dumbbell or cable tricep extension' },
    { name: 'Leg Press', muscle: 'Legs', description: 'Machine leg press' },
    { name: 'Lat Pulldown', muscle: 'Back', description: 'Cable lat pulldown' },
    { name: 'Calf Raise', muscle: 'Legs', description: 'Standing or seated calf raise' },
  ];

  console.log('Starting to seed exercises...');

  for (const exercise of exercisesData) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
