import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { dbConfig } from "../../config";
// Lấy URL kết nối từ biến môi trường
const connectionString = dbConfig.databaseUrl;
// Khởi tạo connection pool từ thư viện 'pg'
const pool = new Pool({ connectionString });

// Gắn pool vào Prisma Adapter
const adapter = new PrismaPg(pool);

// Khởi tạo Prisma Client với adapter
const prisma = new PrismaClient({ adapter });

async function connectDB() {
  await prisma.$connect();
}

connectDB()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
  });

export default prisma;
