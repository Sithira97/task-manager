import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const generateDateObj = (startMonth: number, endMonth: number) => {
  const year = 2026;
  const month = randomInt(startMonth, endMonth);
  const day = randomInt(1, 28);
  const hour = randomInt(8, 18);
  const min = randomElement([0, 15, 30, 45]);
  // Date constructor month is 0-indexed (5 = June, 7 = August)
  return new Date(year, month, day, hour, min);
};

const formatDate = (date: Date) =>
  date.toISOString().slice(0, 19).replace("T", " ");

const addRandomTime = (date: Date, maxDays: number = 5) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + randomInt(1, maxDays * 24));
  return newDate;
};

const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];
const taskVerbs = [
  "Implement",
  "Design",
  "Refactor",
  "Test",
  "Review",
  "Update",
  "Fix",
  "Create",
  "Audit",
  "Deploy",
  "Optimize",
  "Document",
  "Research",
  "Analyze",
];
const taskNouns = [
  "Authentication",
  "Dashboard",
  "API Endpoints",
  "Database Schema",
  "User Profile",
  "Payment Gateway",
  "Search Feature",
  "Email Notifications",
  "Analytics",
  "Frontend Layout",
  "Mobile App",
  "Docker Container",
  "Security Rules",
  "CI/CD Pipeline",
];
const priorities = ["low", "medium", "high"];
const statuses = ["open", "in_progress", "done"];

const seed = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("Connected to DB, truncating existing data...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.query("TRUNCATE TABLE assignees;");
    await connection.query("TRUNCATE TABLE tasks;");
    await connection.query("TRUNCATE TABLE users;");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("Generating 20 users...");
    const defaultPassword =
      "$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2";
    const users = [];
    users.push({
      id: 1,
      username: "System Admin",
      email: "admin@taskmanager.com",
      password: defaultPassword,
      role: "admin",
    });

    for (let i = 2; i <= 20; i++) {
      const fn = randomElement(firstNames);
      const ln = randomElement(lastNames);
      const username = `${fn.toLowerCase()}_${ln.toLowerCase()}${randomInt(1, 999)}`;
      const email = `${username}@taskmanager.com`;
      users.push({
        id: i,
        username,
        email,
        password: defaultPassword,
        role: "user",
      });
    }

    const userValues = users
      .map(
        (u) =>
          `(${u.id}, '${u.username}', '${u.email}', '${u.password}', '${u.role}')`,
      )
      .join(", ");
    await connection.query(
      `INSERT INTO users (\`id\`, \`username\`, \`email\`, \`password\`, \`role\`) VALUES ${userValues}`,
    );

    console.log("Generating 50 tasks spanning June to August...");
    const tasks = [];
    for (let i = 1; i <= 50; i++) {
      const title = `${randomElement(taskVerbs)} ${randomElement(taskNouns)}`;
      const description = `This is a randomly generated task for ${title}. Needs to be completed by the due date.`;
      const priority = randomElement(priorities);
      const status = randomElement(statuses);

      const dueDateObj = generateDateObj(6, 7); // June (5) to August (7)
      const dueDate = formatDate(dueDateObj);

      const createdBy = randomInt(1, 20);

      const createdAtObj = generateDateObj(5, 7); // April to June
      const createdAt = formatDate(createdAtObj);

      const updatedAtObj = addRandomTime(createdAtObj, 14); // up to 14 days later
      const updatedAt = formatDate(updatedAtObj);

      let deletedAt = "NULL";
      if (Math.random() < 0.1) {
        const deletedAtObj = addRandomTime(updatedAtObj, 7); // up to 7 days after update
        deletedAt = `'${formatDate(deletedAtObj)}'`;
      }

      tasks.push({
        id: i,
        title,
        description,
        priority,
        status,
        dueDate,
        createdBy,
        createdAt,
        updatedAt,
        deletedAt,
      });
    }

    const taskValues = tasks
      .map(
        (t) =>
          `(${t.id}, '${t.title}', '${t.description}', '${t.priority}', '${t.status}', '${t.dueDate}', ${t.createdBy}, '${t.createdAt}', '${t.updatedAt}', ${t.deletedAt})`,
      )
      .join(", ");

    await connection.query(
      `INSERT INTO tasks (\`id\`, \`title\`, \`description\`, \`priority\`, \`status\`, \`due_date\`, \`created_by\`, \`created_at\`, \`updated_at\`, \`deleted_at\`) VALUES ${taskValues}`,
    );

    console.log("Generating assignees...");
    const assignees = [];
    for (let i = 1; i <= 50; i++) {
      const numAssignees = randomInt(1, 3);
      const assignedUsers = new Set<number>();
      while (assignedUsers.size < numAssignees) {
        assignedUsers.add(randomInt(1, 20));
      }
      for (const userId of assignedUsers) {
        assignees.push(`(${i}, ${userId}, '${tasks[i - 1].createdAt}')`);
      }
    }

    if (assignees.length > 0) {
      await connection.query(
        `INSERT INTO assignees (\`task_id\`, \`user_id\`, \`assigned_at\`) VALUES ${assignees.join(", ")}`,
      );
    }

    console.log("Seeding complete!");
    await connection.end();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seed();
