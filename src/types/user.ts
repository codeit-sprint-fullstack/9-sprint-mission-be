export type User = {
    id: string;
    email: string
    nickname:string
    encryptedPassword: string | null
    refreshToken: string| null
    provider: string
    providerId: string |null

    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null;
}

/** 비밀번호와 리프레시 토큰이 제외된 유저 타입 */
export type UserProfile = Omit<User, "encryptedPassword" | "refreshToken">