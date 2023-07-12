import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import  ProductForm  from "../ProductForm";
import { useState } from "react";
import  ReviewForm  from "../ReviewForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);
  console.log("PD:", data);

  async function handleEditProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);
    

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      mutate();
    }
  }
  async function handleDeleteProduct() {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      console.log(response.status);
      return <h1>Something gone wrong!</h1>;
    }

    router.push("/");
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <h1>No data!</h1>;
  }

  return (
    <ProductCard>
     <div>
        <button type="button"
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          <span role="img" aria-label="A pencil">
            🪄
          </span>
        </button>
        <button type="button" onClick={() => handleDeleteProduct(id)} disabled={isEditMode}>
          <span role="img" aria-label="A cross indicating deletion">
            ❌
          </span>
        </button>
      </div>
      {isEditMode && (
        <ProductForm onSubmit={handleEditProduct} value={data} isEditMode={true} />
      )}
      <h1>{data.name}</h1>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      <h2>Reviews:</h2>
      <ul>
      {data.reviews.map((review) => (
          <li key={review._id}>
           <h3><i>{review.title}</i></h3>
           <p><i>{review.text}</i></p>
           <p>Rating: <strong>{review.rating}</strong></p>
          </li>))}
      </ul>
      <ReviewForm productData={data}/>     
       <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
