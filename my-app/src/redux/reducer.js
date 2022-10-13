import { labels, names, projects, skills, styles } from '../data' ;

export const initialState = {
    projects: projects,
    skills: skills,
    names: names,
    labels: labels,
    styles: styles
};

export const Reducer = (state = initialState, action) => {
    return state;
};