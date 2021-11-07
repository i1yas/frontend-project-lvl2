export default {
    roots: ["."],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    moduleFileExtensions: ["ts", "js", "json", "node"],
    clearMocks: true,
};
