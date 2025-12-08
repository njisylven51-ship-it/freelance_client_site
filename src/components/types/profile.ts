export interface Profile {
    name: string;
    title: string;
    location: string;
    about: string;
    email: string;
    skills: string[];
    photo: string;
    socials : {
        github: string;
        linkedin: string;
        twitter: string;
        about: string;
    };
}