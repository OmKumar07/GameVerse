import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api/",
  params: {
    key: "013463f3aa954e528acfadc53fda1cf8",
  },
});
