import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    id: bigint;
    bio: string;
    name: string;
    role: UserRole;
    email: string;
    followedUsers: Array<Principal>;
    profilePicture?: ExternalBlob;
}
export enum BookType {
    hardcover = "hardcover",
    ebook = "ebook",
    audiobook = "audiobook",
    softcover = "softcover"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBook(title: string, authorName: string, description: string, price: number, genre: string, isEbook: boolean, bookType: BookType): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBook(bookId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBook(bookId: string, title: string, authorName: string, description: string, price: number, genre: string, isEbook: boolean, bookType: BookType): Promise<void>;
}
