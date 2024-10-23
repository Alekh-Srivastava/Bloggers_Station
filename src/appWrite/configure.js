import {Client,Account, ID,Databases,Storage,Query} from 'appwrite'
import config from '../config/config';

export class Service{
    client = new Client();
    database;
    bucket;

    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        this.database = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("Creating post with the following data:", {
                title,
                slug,
                content,
                featuredImage,
                status,
                userId,
            });
    
            // Ensure userId is passed properly
            if (!userId) {
                throw new Error("Missing required field: userId");
            }
    
            // Create the document in Appwrite
            const response = await this.database.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug, // Ensure slug is unique for each post
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );
    
            console.log("Post created successfully:", response);
            return response;
        } catch (error) {
            console.log("Appwrite :: createPost :: error ", error.message, error); // More detailed error logging
            return false;
        }
    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.database.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite :: updatePost ::error ",error);
        }
    }

    async deletePost(slug){
        try {
            await this.database.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite :: deletePost ::error ",error);
            return false
        }
    }

    async getPost(slug){
        try {
           return  await this.database.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite :: getPost ::error ",error);
            return false
        }
    }


    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.database.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite :: getPosts ::error ",error);
            return false
        }
    }

    async uploadFile(file){
        try {
           return  await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite :: uploadFile ::error ",error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite :: deleteFile ::error ",error);
            return false
        }
    }

    async getFilePreview(fileId){
        return this.bucket.getFilePreview(
            config.appwriteBucketId,
            fileId
        )
    }

};

const obj = new Service()
export default obj;