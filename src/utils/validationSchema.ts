import { z } from "zod"

const emailSchema = z.string().email({ message: "Invalid email format" })
const passwordSchema = z.string().min(8, { message: "Password must be at least 8 characters." })
 
export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const emailVerificationFormSchema = z.object({
  verificationCode: z.string().min(6, { message: "Verification code must be at least 6 characters." }),
})

export const mfaFormSchema = z.object({
  totpCode: z.string().length(6, { message: "TOTP code must be exactly 6 digits" }),
})
