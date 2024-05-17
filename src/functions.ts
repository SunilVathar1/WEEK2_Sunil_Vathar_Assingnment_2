  
  interface Student {
    name: string;
    age: number;
    grade: number;
  }
  
   export const filterPassedStudents = (students: Student[]): Student[] => {
    return students.filter((student) => student.grade >= 50);
  }
  
  export const getStudentNames=(students:Student[])=>{
    return students.map((student) => student.name);
  }

  export const sortStudentsByGrade=(students:Student[])=>{
    return students.sort((a, b) => a.grade - b.grade);
  }

  export const  getAverageAge=(students:Student[])=>{
    const totalAge = students.reduce((sum, student) => sum + student.age, 0);
    return totalAge / students.length;
  }
 