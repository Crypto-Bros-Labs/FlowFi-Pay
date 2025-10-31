export interface UpdateUserData {
    userUuid: string;
    phone: string;
    fullName: string;
    image: string;
}

export interface UserDataResponse {
    userUuid: string;
    phone: string;
    fullName: string;
    email: string;
    image: string;
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