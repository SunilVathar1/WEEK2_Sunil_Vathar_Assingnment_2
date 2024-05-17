import express, { Request, Response } from 'express';
import { pool } from './pgConfig';
import { filterPassedStudents, getAverageAge, getStudentNames, sortStudentsByGrade } from './functions';
import { sequelize,Student} from './pgConfig';

const app = express();
const port = 3000;

// a. FilterOut the Orders whose any OrderBlock’s LineNo is divisible by 3
// b. Now store orderIDs in your postgres database , iteratively
// Database - TestOrder
// Table orders
// Columns — id | orderID
// (Make use of inbuilt functions for filtering out)

interface OrderBlock {
  lineNo: number[] | number;
  ProductCode: string;
}

interface Order {
  orderID: string;
  orderInvoiceNo: string;
  OrderBlocks: OrderBlock[];
}

interface PayloadData {
  items: Order[];
}

app.use(express.json());

app.post('/filter-orders', async (req: Request, res: Response) => {
  const payload: PayloadData = req.body;

  // Filter orders based on the condition
  const filteredOrders = payload.items.filter((order) => {
    return !order.OrderBlocks.some((block) => {
      const lineNos = Array.isArray(block.lineNo) ? block.lineNo : [block.lineNo];
      return lineNos.some((lineNo) => lineNo % 3 === 0);
    });
  });

  try {
    // Iterate over each item and extract the order ID
    for (const item of payload.items) {
      const orderId = item.orderID;

      // Insert the order ID into the database
      const query = 'INSERT INTO "Order" (orderID) VALUES ($1) RETURNING id';
      const result = await pool.query(query, [orderId]);
      console.log(`Order ID ${orderId} inserted with ID ${result.rows[0].id}`);
    }

    res.status(200).json({
      message: 'Order IDs stored successfully',
      filteredOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error storing order IDs' });
  }
});

// Excercise with the all array functions by taking array of your own choice (Remember the array should be taken as payload from postman)


app.post('/process-numbers', (req: Request, res: Response) => {
  const numbers: number[] = req.body.sampleArray;

  //  Filter numbers based on a condition (e.g., even numbers)
  const evenNumbers = numbers.filter(num => num % 2 === 0);
  console.log('Even numbers:', evenNumbers);

  //  Map numbers to a new array with modified values (e.g., square roots)
  const squareRoots = numbers.map(num => Math.sqrt(num));
  console.log('Square roots:', squareRoots);

  //  Reduce numbers to a single value (e.g., sum of all numbers)
  const sum = numbers.reduce((total, num) => total + num, 0);
  console.log('Sum of all numbers:', sum);

  //  Find a number based on a condition (e.g., first number greater than 50)
  const firstGreaterThan50 = numbers.find(num => num > 50);
  console.log('First number greater than 50:', firstGreaterThan50);

  //  Check if any number meets a condition (e.g., number greater than 75)
  const hasGreaterThan75 = numbers.some(num => num > 75);
  console.log('Has a number greater than 75:', hasGreaterThan75);

  //  Check if all numbers meet a condition positive numbers
  const allPositive = numbers.every(num => num > 0);
  console.log('All numbers are positive:', allPositive);

  //  Flatten nested arrays (e.g., [[1, 2], [3, 4], [5]] => [1, 2, 3, 4, 5])
  const nestedNumbers = [[1, 2], [3, 4], [5]];
  const flattenedNumbers = nestedNumbers.flatMap(arr => arr);
  console.log('Flattened numbers:', flattenedNumbers);

  const includes25 = numbers.includes(25);
  console.log('Includes 25:', includes25);

  //  Join numbers into a string
  const numbersString = numbers.join(' ');
  console.log('Numbers string:', numbersString);
  console.log(typeof numbersString);
  
  res.json({ message: 'Numbers processed successfully' });
});

const students = [
  { name: "Alice", age: 20, grade: 75 },
  { name: "Bob", age: 22, grade: 85 },
  { name: "Charlie", age: 21, grade: 60 },
  { name: "David", age: 19, grade: 45 },
  { name: "Eve", age: 20, grade: 90 }
  ];

//   1. Write a function filterPassedStudents(students) that takes an array of student objects as input and returns a new array containing only the students
// who passed. Students who passed have a grade greater than or equal to 50.

const PassedStudents = filterPassedStudents(students);
console.log(PassedStudents); 

// 2. Write a function getStudentNames(students) that takes an array of student objects as input and returns an array containing only the names of the
// students.


const StudentNames=getStudentNames(students);
console.log(StudentNames);

// 3. Write a function sortStudentsByGrade(students) that takes an array of student objects as input and returns a new array containing the students
// sorted by their grades in ascending order.

const ascendingOrderGrades=sortStudentsByGrade(students)
console.log(ascendingOrderGrades);

// 4. Write a function getAverageAge(students) that takes an array of student objects as input and returns the average age of all the students.

const AverageAgeofStudents=getAverageAge(students)
console.log("Average age of Students is : "+AverageAgeofStudents);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

// In the notes , it was prompted to firstly create table before running Create query , Is it possble to create a function that will check the existence of
// table before adding any entity in the table. If the table does not exist , it should create one. Implement once to che

// ans : actually we can do this with sequlize provides sync() it will sync with database we have provided and checks the table is present or else it will create for Us

// Here is the example for sequlize sync()

async function checkAndCreateTable() {
  try {
      // Sync all defined models to the DB.
      await sequelize.sync();
      console.log('All models were synchronized successfully.');
  } catch (error) {
      console.error('Unable to sync the database:', error);
  }
}

async function addStudent(student: { name: string; age: number }) {
  // Ensure the table exists
  await checkAndCreateTable();

  try {
      // Add the student to the database
      const newStudent = await Student.create(student);
      console.log('Student added successfully:', newStudent.toJSON());
  } catch (error) {
      console.error('Error adding student:', error);
  }
}

// Example usage:
const newStudent = { name: 'Sanoj', age: 55 };
addStudent(newStudent);