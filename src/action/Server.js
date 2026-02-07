'use server'

import { dbConnect } from "@/lib/dbConnect"
import bcrypt from 'bcryptjs';
export const postUser = async (data) => {
     const ExistsingUser = await dbConnect('user').findOne(
          {
               email: data.email
          }
     )
     if (ExistsingUser) {
          return {
               success: false,
               message: 'User already exists'
          }

     }
     const hashingPassword = await bcrypt.hash(data.password, 10)
     const res = await dbConnect('user').insertOne(
          {
               ...data,
               password: hashingPassword,
               createdAt: new Date().toISOString(),
               role: 'user'
          }
     )
     if (res.acknowledged) {
          return {
               success: true,
               message: `user registered successfully ${res.insertedId.toString()}`
          }
     }
}

