const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('./models/Quiz');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz_master';

const sampleQuizzes = [
    {
        title: 'Mathematics Fundamentals',
        description: 'Test your knowledge of basic and advanced mathematics concepts',
        questions: [
            {
                question: 'What is the square root of 144?',
                options: [
                    '10',
                    '12',
                    '14',
                    '16'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the value of π (pi) to two decimal places?',
                options: [
                    '3.12',
                    '3.14',
                    '3.16',
                    '3.18'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the sum of angles in a triangle?',
                options: [
                    '90 degrees',
                    '180 degrees',
                    '270 degrees',
                    '360 degrees'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is 2 to the power of 5?',
                options: [
                    '16',
                    '32',
                    '64',
                    '128'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the formula for the area of a circle?',
                options: [
                    'πr²',
                    '2πr',
                    'πd',
                    'r²'
                ],
                correctAnswer: 0
            },
            {
                question: 'What is the next number in the sequence: 2, 4, 8, 16, ?',
                options: [
                    '24',
                    '32',
                    '36',
                    '40'
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        title: 'World History & Geography',
        description: 'Questions about world history, geography, and important events',
        questions: [
            {
                question: 'In which year did World War II end?',
                options: [
                    '1943',
                    '1944',
                    '1945',
                    '1946'
                ],
                correctAnswer: 2
            },
            {
                question: 'What is the capital of Australia?',
                options: [
                    'Sydney',
                    'Melbourne',
                    'Canberra',
                    'Perth'
                ],
                correctAnswer: 2
            },
            {
                question: 'Which ocean is the largest?',
                options: [
                    'Atlantic Ocean',
                    'Indian Ocean',
                    'Pacific Ocean',
                    'Arctic Ocean'
                ],
                correctAnswer: 2
            },
            {
                question: 'Who was the first person to walk on the moon?',
                options: [
                    'Buzz Aldrin',
                    'Neil Armstrong',
                    'Michael Collins',
                    'Yuri Gagarin'
                ],
                correctAnswer: 1
            },
            {
                question: 'Which country is known as the Land of the Rising Sun?',
                options: [
                    'China',
                    'Japan',
                    'Korea',
                    'Thailand'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the longest river in the world?',
                options: [
                    'Amazon River',
                    'Nile River',
                    'Yangtze River',
                    'Mississippi River'
                ],
                correctAnswer: 1
            },
            {
                question: 'In which year did the Berlin Wall fall?',
                options: [
                    '1987',
                    '1989',
                    '1991',
                    '1993'
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        title: 'Science & Nature',
        description: 'Test your knowledge of science, biology, chemistry, and physics',
        questions: [
            {
                question: 'What is the chemical symbol for water?',
                options: [
                    'H2O',
                    'CO2',
                    'O2',
                    'NaCl'
                ],
                correctAnswer: 0
            },
            {
                question: 'Which planet is known as the Red Planet?',
                options: [
                    'Venus',
                    'Mars',
                    'Jupiter',
                    'Saturn'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the smallest unit of life?',
                options: [
                    'Atom',
                    'Cell',
                    'Molecule',
                    'Organ'
                ],
                correctAnswer: 1
            },
            {
                question: 'How many bones are there in an adult human body?',
                options: [
                    '196',
                    '206',
                    '216',
                    '226'
                ],
                correctAnswer: 1
            },
            {
                question: 'What gas do plants absorb from the atmosphere?',
                options: [
                    'Oxygen',
                    'Carbon Dioxide',
                    'Nitrogen',
                    'Hydrogen'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the speed of light in vacuum?',
                options: [
                    '299,792,458 m/s',
                    '300,000,000 m/s',
                    '299,000,000 m/s',
                    '300,792,458 m/s'
                ],
                correctAnswer: 0
            },
            {
                question: 'Which blood type is known as the universal donor?',
                options: [
                    'A+',
                    'B+',
                    'AB+',
                    'O-'
                ],
                correctAnswer: 3
            }
        ]
    },
    {
        title: 'Sports World',
        description: 'Questions about various sports, athletes, and championships',
        questions: [
            {
                question: 'How many players are on a basketball team on the court at one time?',
                options: [
                    '4',
                    '5',
                    '6',
                    '7'
                ],
                correctAnswer: 1
            },
            {
                question: 'Which country has won the most FIFA World Cups?',
                options: [
                    'Germany',
                    'Argentina',
                    'Brazil',
                    'Italy'
                ],
                correctAnswer: 2
            },
            {
                question: 'In which sport is the term "Ace" used?',
                options: [
                    'Tennis',
                    'Basketball',
                    'Football',
                    'Golf'
                ],
                correctAnswer: 0
            },
            {
                question: 'How many rings are in the Olympic symbol?',
                options: [
                    '4',
                    '5',
                    '6',
                    '7'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the distance of a marathon race?',
                options: [
                    '26.2 miles',
                    '25 miles',
                    '27 miles',
                    '28 miles'
                ],
                correctAnswer: 0
            },
            {
                question: 'Which sport is played at Wimbledon?',
                options: [
                    'Cricket',
                    'Tennis',
                    'Golf',
                    'Badminton'
                ],
                correctAnswer: 1
            },
            {
                question: 'Who holds the record for most goals in FIFA World Cup history?',
                options: [
                    'Pele',
                    'Miroslav Klose',
                    'Ronaldo',
                    'Lionel Messi'
                ],
                correctAnswer: 1
            },
            {
                question: 'In which year were the first modern Olympics held?',
                options: [
                    '1892',
                    '1896',
                    '1900',
                    '1904'
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        title: 'Music & Songs',
        description: 'Test your knowledge of music, famous songs, artists, and music history',
        questions: [
            {
                question: 'Who is known as the "King of Pop"?',
                options: [
                    'Elvis Presley',
                    'Michael Jackson',
                    'Prince',
                    'Madonna'
                ],
                correctAnswer: 1
            },
            {
                question: 'Which band sang "Bohemian Rhapsody"?',
                options: [
                    'The Beatles',
                    'Queen',
                    'Led Zeppelin',
                    'Pink Floyd'
                ],
                correctAnswer: 1
            },
            {
                question: 'How many strings does a standard guitar have?',
                options: [
                    '4',
                    '5',
                    '6',
                    '7'
                ],
                correctAnswer: 2
            },
            {
                question: 'What is the highest female singing voice?',
                options: [
                    'Alto',
                    'Mezzo-soprano',
                    'Soprano',
                    'Tenor'
                ],
                correctAnswer: 2
            },
            {
                question: 'Which instrument has 88 keys?',
                options: [
                    'Organ',
                    'Piano',
                    'Harpsichord',
                    'Accordion'
                ],
                correctAnswer: 1
            },
            {
                question: 'Who wrote the song "Imagine"?',
                options: [
                    'Paul McCartney',
                    'John Lennon',
                    'Bob Dylan',
                    'Elton John'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the most common time signature in music?',
                options: [
                    '2/4',
                    '3/4',
                    '4/4',
                    '6/8'
                ],
                correctAnswer: 2
            },
            {
                question: 'Which musical note lasts the longest?',
                options: [
                    'Whole note',
                    'Half note',
                    'Quarter note',
                    'Eighth note'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        title: 'General Knowledge',
        description: 'A mix of general knowledge questions covering various topics',
        questions: [
            {
                question: 'What is the hardest natural substance on Earth?',
                options: [
                    'Gold',
                    'Iron',
                    'Diamond',
                    'Platinum'
                ],
                correctAnswer: 2
            },
            {
                question: 'How many continents are there?',
                options: [
                    '5',
                    '6',
                    '7',
                    '8'
                ],
                correctAnswer: 2
            },
            {
                question: 'What is the largest mammal in the world?',
                options: [
                    'African Elephant',
                    'Blue Whale',
                    'Giraffe',
                    'Polar Bear'
                ],
                correctAnswer: 1
            },
            {
                question: 'Which fruit is known as the "King of Fruits"?',
                options: [
                    'Apple',
                    'Mango',
                    'Banana',
                    'Orange'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the smallest country in the world?',
                options: [
                    'Monaco',
                    'Vatican City',
                    'San Marino',
                    'Liechtenstein'
                ],
                correctAnswer: 1
            },
            {
                question: 'How many hours are in a day?',
                options: [
                    '20',
                    '24',
                    '26',
                    '28'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the capital of France?',
                options: [
                    'Lyon',
                    'Marseille',
                    'Paris',
                    'Nice'
                ],
                correctAnswer: 2
            },
            {
                question: 'Which planet is closest to the Sun?',
                options: [
                    'Venus',
                    'Earth',
                    'Mercury',
                    'Mars'
                ],
                correctAnswer: 2
            },
            {
                question: 'What is the chemical symbol for gold?',
                options: [
                    'Go',
                    'Gd',
                    'Au',
                    'Ag'
                ],
                correctAnswer: 2
            },
            {
                question: 'How many sides does a hexagon have?',
                options: [
                    '4',
                    '5',
                    '6',
                    '7'
                ],
                correctAnswer: 2
            }
        ]
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing quizzes
        await Quiz.deleteMany({});
        console.log('Cleared existing quizzes');

        // Insert sample quizzes
        const insertedQuizzes = await Quiz.insertMany(sampleQuizzes);
        console.log(`Successfully seeded ${insertedQuizzes.length} quizzes`);
        console.log('\nQuizzes created:');
        insertedQuizzes.forEach(quiz => {
            console.log(`- ${quiz.title} (${quiz.questions.length} questions)`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
