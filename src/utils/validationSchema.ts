import { z } from "zod"
 
export const signUpFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email format"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email format"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export const emailVerificationFormSchema = z.object({
  // email: z.string().email({
  //   message: "Invalid email format"
  // }).optional(),
  verificationCode: z.string().min(2, {
    message: "Invalid code",
  }),
})

export const mfaFormSchema = z.object({
  totpCode: z.string().min(6, {
    message: "Code must be of 6 digits",
  }),
})