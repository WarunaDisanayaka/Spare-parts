import { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>HONDA</title>
      </Helmet>
      <div className="hero-slider">
        <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
          <div>
            <img
              src="/images/slider1.png"
              alt="Hero Image 1"
            />
            <div className="carousel-caption d-none d-md-block">
              <h1>Welcome to our website!</h1>
              <p>
                We offer a wide range of products and services to meet your
                needs.
              </p>
            </div>
          </div>
          <div>
            <img
              src="/images/slider2.webp"
              alt="Hero Image 2"
            />
            <div className="carousel-caption d-none d-md-block">
              <h1>Check out our latest deals!</h1>
              <p>Save big on selected items while supplies last.</p>
            </div>
          </div>
          
        </Carousel>
      </div>
      <div className="products mt-5">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
