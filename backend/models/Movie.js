import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    videoUrl: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String },
    limit: { type: Number, default: 13 }, // age
    isSeries: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;