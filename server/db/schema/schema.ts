import { bigint, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const userSchema = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  reset_token: varchar('reset_token', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const booksSchema = mysqlTable('books', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  publisher: varchar('publisher', { length: 255 }).notNull(),
  isbn: varchar('isbn', { length: 255 }).notNull(),
  issn: varchar('issn', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  year: bigint('year', { mode: 'number', unsigned: true }).notNull(),
  price: bigint('price', { mode: 'number', unsigned: true }).notNull(),
  notes: varchar('notes', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
