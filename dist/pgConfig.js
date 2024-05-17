"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.sequelize = exports.pool = void 0;
const pg_1 = require("pg");
const sequelize_1 = require("sequelize");
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TestOrder',
    password: 'system',
    port: 5432
});
//Initialize Sequelize with PostgreSQL
const sequelize = new sequelize_1.Sequelize('TestOrder', 'postgres', 'system', {
    host: 'localhost',
    dialect: 'postgres',
});
exports.sequelize = sequelize;
class Student extends sequelize_1.Model {
}
exports.Student = Student;
Student.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
});
//# sourceMappingURL=pgConfig.js.map