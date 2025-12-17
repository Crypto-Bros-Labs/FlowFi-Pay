
export interface UpdateUserData {
    userUuid: string;
    phone: string;
    fullName: string;
    image: string;
}

export interface UserDataResponse {
    userUuid: string;
    role: string;
    phone: string;
    fullName: string;
    email: string;
    image: string;
    normalizedPublicKey: string;
    balance: string;
    formatBalance: string;
}

export interface UserData {
    data: UserDataResponse;
    message: string;
    success: boolean;
    status: string;
    code: number;
}

export interface UserPictureResponse {
    data: string;
    message: string;
    success: boolean;
    status: string;
    code: number;
}

export type KycStatusResponse = {
    status: string;
    kycDetails: string;
    kycUrl: string;
};

export type TeamMemberRequest = {
    ownerUserUuid: string;
    memberFullName: string;
    memberEmail: string;
    roleType: string;
};