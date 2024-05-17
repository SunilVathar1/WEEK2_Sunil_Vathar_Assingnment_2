import { Pool } from "pg"
import { Sequelize,Model, DataTypes } from "sequelize";

 export const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'TestOrder',
    password:'system',
    port:5432
});


//Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize('TestOrder', 'postgres', 'system', {
    host: 'localhost',
    dialect: 'postgres',
});

class Student extends Model {
    public id!: number;
    public name!: string;
    public age!: number;
}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Student',
        tableName: 'students',
    }
);

export { sequelize, Student };
