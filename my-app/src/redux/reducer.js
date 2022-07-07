import { names, projects, skills } from '../data' ;

export const initialState = {
    projects: projects,
    skills: skills,
    names: names
};

export const Reducer = (state = initialState, action) => {
    return state;
};