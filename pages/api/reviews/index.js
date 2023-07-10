import dbConnect from "../../../db/connect";
import Review from "../../../db/models/Review";

export default async function handler(request, response) {
  await dbConnect();
  if (request.method === "GET") {
    const reviews = await Review.find();
    return response.status(200).json(reviews);
  } else if (request.method === "POST") {
    try {
      const reviewData = request.body;
      const dataReviews = await Review.create(reviewData);

      response.status(201).json({ status: "Review created", data: dataReviews });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
