"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pgConfig_1 = require("./pgConfig");
const functions_1 = require("./functions");
const pgConfig_2 = require("./pgConfig");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('/filter-orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
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
            const result = yield pgConfig_1.pool.query(query, [orderId]);
            console.log(`Order ID ${orderId} inserted with ID ${result.rows[0].id}`);
        }
        res.status(200).json({
            message: 'Order IDs stored successfully',
            filteredOrders,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error storing order IDs' });
    }
}));
// Excercise with the all array functions by taking array of your own choice (Remember the array should be taken as payload from postman)
app.post('/process-numbers', (req, res) => {
    const numbers = req.body.sampleArray;
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
const PassedStudents = (0, functions_1.filterPassedStudents)(students);
console.log(PassedStudents);
// 2. Write a function getStudentNames(students) that takes an array of student objects as input and returns an array containing only the names of the
// students.
const StudentNames = (0, functions_1.getStudentNames)(students);
console.log(StudentNames);
// 3. Write a function sortStudentsByGrade(students) that takes an array of student objects as input and returns a new array containing the students
// sorted by their grades in ascending order.
const ascendingOrderGrades = (0, functions_1.sortStudentsByGrade)(students);
console.log(ascendingOrderGrades);
// 4. Write a function getAverageAge(students) that takes an array of student objects as input and returns the average age of all the students.
const AverageAgeofStudents = (0, functions_1.getAverageAge)(students);
console.log("Average age of Students is : " + AverageAgeofStudents);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
pgConfig_2.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
function checkAndCreateTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Sync all defined models to the DB.
            yield pgConfig_2.sequelize.sync();
            console.log('All models were synchronized successfully.');
        }
        catch (error) {
            console.error('Unable to sync the database:', error);
        }
    });
}
function addStudent(student) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the table exists
        yield checkAndCreateTable();
        try {
            // Add the student to the database
            const newStudent = yield pgConfig_2.Student.create(student);
            console.log('Student added successfully:', newStudent.toJSON());
        }
        catch (error) {
            console.error('Error adding student:', error);
        }
    });
}
// Example usage:
const newStudent = { name: 'Sanoj', age: 55 };
addStudent(newStudent);
//# sourceMappingURL=app.js.map