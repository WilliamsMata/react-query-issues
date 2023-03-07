import axios from "axios";

export const githubApi = axios.create({
  baseURL: "https://api.github.com/repos/facebook/react",
  headers: {
    Authorization:
      "Bearer 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",
  },
});
