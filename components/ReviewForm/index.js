import { StyledForm, StyledHeading, StyledLabel } from "./ReviewForm.styled";
import { StyledButton } from "../Button/Button.styled";
import useSWR from "swr";

export default function ReviewForm({ productData }) {
  const { mutate } = useSWR(`/api/products/${productData._id}`);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reviewData = Object.fromEntries(formData);

    const responseReview = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (responseReview.ok) {
      const data = await responseReview.json();
      const responseProduct = await fetch(`/api/products/${productData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData,
          reviews: [...productData.reviews, data.data._id],
        }),
      });

      if (responseProduct.ok) {
        mutate();
      }
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledHeading>Add a new Review</StyledHeading>
      <StyledLabel htmlFor="title">
        Title:
        <input type="title" id="title-input" name="title" />
      </StyledLabel>
      <StyledLabel htmlFor="text">
        Text:
        <input type="text" id="text-input" name="text" />
      </StyledLabel>
      <StyledLabel htmlFor="rating">
        Rating:
        <select id="rating-input" name="rating">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </StyledLabel>
      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
}
