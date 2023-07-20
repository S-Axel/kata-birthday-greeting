import { trimString } from './stringUtils';
import { convertFileToString } from './fileUtils';

interface Employee {
  firstName: string,
  lastName: string,
  birthdate: Date,
  mail: string,
}

const convertBirthdateStringToDate = (birthdateString: string) => {
  const birthdateInfo = birthdateString.split('/');
  if (birthdateInfo.length !== 3) {
    throw new Error('Cannot read birthdate');
  }
  const birthdate = new Date();
  birthdate.setMonth(Number(birthdateInfo[1]) - 1);
  birthdate.setDate(Number(birthdateInfo[0]));
  return birthdate;
};

const convertFileLineToEmployee = (line: string): Employee => {
  let employeeInfo = line
    .split(',')
    .map(trimString);

  if (employeeInfo.length !== 4 || employeeInfo.some(info => info === '')) {
    throw new Error('Invalid file format');
  }

  let birthdate: Date | null = null;
  try {
    birthdate = convertBirthdateStringToDate(employeeInfo[2]);
  } catch (e: any) {
    throw new Error(`${employeeInfo[0]} ${employeeInfo[1]}: ${e.message}`);
  }

  return {
    firstName: employeeInfo[0],
    lastName: employeeInfo[1],
    birthdate,
    mail: employeeInfo[3],
  }
};

const computeFileLine = (fileName: string) => (line: string) => {
  try {
    let employee: Employee = convertFileLineToEmployee(line);

    let now = new Date();
    if (now.getDate() !== employee.birthdate.getDate() || now.getMonth() !== employee.birthdate.getMonth()) {
      return;
    }

    App.sendEmail(
      employee.mail,
      'Joyeux Anniversaire !',
      `Bonjour ${employee.firstName},\nJoyeux Anniversaire !\nA bientôt,`
    );

  } catch (error) {
    console.log(error);
    console.error(`Error reading file '${fileName}'`);
  }

};

class App {
  static main() {
    let fileName = './employees.txt';

    try {
      const content = convertFileToString(fileName);
      const contentArray = content.split('\n');
      contentArray.shift();
      console.log('Reading file...');
      contentArray.forEach(computeFileLine(fileName))
      console.log('Batch job done.');
    } catch (error) {
      console.error(`Error reading file '${fileName}'`);
    }
  }

  static sendEmail(to: string, title: string, body: string) {
    console.log(`Sending email to: ${to}`);
    console.log(`Title: ${title}`);
    console.log(`Body: Body\n${body}`);
    console.log('-------------------------');
  }
}

App.main();
