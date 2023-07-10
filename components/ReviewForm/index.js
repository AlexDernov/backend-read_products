import { StyledForm, StyledHeading, StyledLabel } from "./ReviewForm.styled";
import { StyledButton } from "../Button/Button.styled";
import useSWR from "swr";
/* import { useRouter } from "next/router"; */

export default function ReviewForm({id, productData}) {
 /*  const router = useRouter();
  const { id } = router.query; */

  const { mutate } = useSWR("/api/reviews");
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reviewData = Object.fromEntries(formData);
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
     /*  const data = await response.json(); */
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...productData,/* /*  productData.reviews*/} ),
      });
      mutate();
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
