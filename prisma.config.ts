import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Đường dẫn trỏ tới file schema của bạn (mặc định là ./prisma/schema.prisma)
  schema: './prisma/schema.prisma',
  
  // Khai báo kết nối cho CLI (dùng cho migrate, db push, v.v.)
  datasource: {
    url: env('DATABASE_URL'),
  },
});