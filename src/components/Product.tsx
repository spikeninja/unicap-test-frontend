
interface ProductProps {
  name: string
  location: string
  imageUrl: string
  state: string
  productUrl: string
}

const Product = ({name, location, imageUrl, state, productUrl }: ProductProps) => {
  return (
    <div style={{
      border: '1px solid #323232',
      marginTop: 10,
      display: 'flex',
    }}>
      <div>
        <img src={imageUrl} alt="image" />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <p><b>Name:</b> {name}</p>
        <p><b>State</b>: {state}</p>
        <p><b>Location</b>: {location}</p>
        <a href={productUrl} target="_blank">Go to product</a>
      </div>
    </div>
  )
}

export default Product;
