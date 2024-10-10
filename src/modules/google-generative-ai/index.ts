import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBbNnegkFHnOKNllnWEBc8-nAecFCfoD6M";

const GoogleGenAI = new GoogleGenerativeAI(API_KEY);
export * from "@google/generative-ai";
export default GoogleGenAI;
