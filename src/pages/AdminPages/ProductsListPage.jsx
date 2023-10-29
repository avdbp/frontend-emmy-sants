/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import authService from '../../services/auth.service.js';
import './ProductsListPage.css'


function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('todas');

  function productsFiltered() {
    let response = products;

    if (filterCategory !== "todas") {
      response = response.filter(prod => prod.categoria === filterCategory);
    }

    return response;
  }

  const axiosProducts = () => {
    const backendUrl =process.env.REACT_APP_SERVER_URL;

    authService.api
      .get(`${backendUrl}/api/products`)
      .then((response) => {
          response.data.map(prod =>  
            prod.imagen = prod.imagen.replace("/upload","/upload/w_250")
           )
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    axiosProducts();
  }, []);

  const handleDeleteProduct = (productId) => {
    const backendUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5005';
  
    authService.api
      .delete(`${backendUrl}/api/products/${productId}`)
      .then(() => {
        // Actualiza la lista de productos después de eliminar el producto
        axiosProducts();
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
      });
  };
  

  return (
    <div className="contentProducts">
      <Container>
        <Row>
          <Col lg={3}>
            {/* Filtros de Categoría */}
            <h2>Panel de Control </h2>
            <ul className="list-group">
              <li className={`list-group-item ${filterCategory === 'todas' ? 'active' : ''}`} onClick={() => setFilterCategory("todas")}>Todos los productos</li>
              <li className={`list-group-item ${filterCategory === 'ramos' ? 'active' : ''}`} onClick={() => setFilterCategory("ramos")}>Ramos</li>
              <li className={`list-group-item ${filterCategory === 'plantas' ? 'active' : ''}`} onClick={() => setFilterCategory("plantas")}>Plantas</li>
            </ul>

            <div className="d-grid gap-2 m-3">
              <Link className="btn btn-info btn-block" to={"/admin/add-product"}>
                Crear Producto
              </Link>
              <Link className="btn btn-warning btn-block text-dark" to={"/admin/orders"}>
                Ver ordenes
              </Link>
            </div>
          </Col>
          <Col lg={9}>
            <Row>
              {productsFiltered().map((product) => (
                <Col key={product._id} xs={12} sm={4} md={4} lg={4}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={product.imagen}
                      alt={product.nombre}
                      style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                    <Card.Body className='card'>
                      <Card.Title>{product.nombre}</Card.Title>
                      <Card.Text className='cardText'>{product.descripcion.slice(0,52)}...</Card.Text>
                      <Card.Text>Precio: {product.precio}€</Card.Text>
                      <Card.Text>Categoría: {product.categoria}</Card.Text>
                      <Link to={`/admin/products/${product._id}`} className="mr-3 btn-info text-light btn">
                        Detalles
                      </Link>
                      <Button className='mr-3' variant="danger" onClick={() => handleDeleteProduct(product._id)}>
                        Eliminar
                      </Button>

                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductsListPage;