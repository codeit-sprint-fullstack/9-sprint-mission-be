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

/** Repository에서 반환할 정보만 정의한 타입*/
// select문에서 UserProfile을 사용하면 나머지 필드 createdAt, provider등 모두 반환될것으로 기대하지만
// 실제 select문에는 없으므로 컴파일에러가 나며,  Pick으로 정확히 지정하지 않고 한다면 코드수가 늘어날것
export type UserSelectProfile =  Pick<User, "id" | "email" | "nickname">