/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './OrderPage.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const axiosOrders = () => {
    const backendUrl = process.env.REACT_APP_SERVER_URL;
    axios
      .get(`${backendUrl}/api/orders`)
      .then((response) => {
        console.log(response);
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setTotalOrders(sortedOrders.length);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    axiosOrders();
  }, []);

  return (
    <Container>
      <br />
      <br />
      <h2 className='titleOrders'>Número de Pedidos: {totalOrders}</h2>
      <Row>
        {orders.map((order, i) => (
          <Col key={i} xs={12} lg={4}>
            <Card style={{ width: '100%' }}>
              <Card.Body className='cardBodyOrder'>
                <Card.Title>
                  <h4>Comprador:<br/> {order.usuario ? `${order.usuario.firstName} ${order.usuario.lastName}` : "Usuario no disponible"}</h4>
                  <h6>Número de Orden: {order._id ? order._id : "ID no disponible"}</h6>
                </Card.Title>
                <Card.Text>
                  Estado: {order.state ? order.state : "Estado no disponible"}
                  Fecha de Creación: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Fecha no disponible"}
                  {/* StrapiID: <p className='strapiFont' >{order.strapiID ? order.strapiID : "Nombre no disponible"}</p>
                  <hr></hr> */}
                  
                </Card.Text>
                <ul className="list-group list-group-flush">
                  {order.products.map((productInfo, y) => (
                    <li className="list-group-item" key={y}>
                      Producto: {productInfo.product ? productInfo.product.nombre : "Nombre no disponible"}
                    <br/>
                      Cantidad: {productInfo.amount ? productInfo.amount : "Cantidad no disponible"} -
                      
                      Precio del Producto: {productInfo.product ? productInfo.product.precio : "Nombre no disponible"}€
                      <br/>
                      Precio Total: {productInfo.product && productInfo.amount
                        ? `${productInfo.product.precio * productInfo.amount}€`
                        : "Precio total no disponible"}
                      <br />
                      <img
                        src={productInfo.product ? productInfo.product.imagen : ""}
                        alt={productInfo.product ? productInfo.product.nombre : "Imagen no disponible"}
                        className="img-fluid"
                        style={{ width: '50%' }} // Reducir el tamaño de la imagen
                      />
                    </li>
                  ))}
                </ul>
                <br/>
                <h3>Total Compra: {calculateTotalPrice(order.products)}€</h3>
              </Card.Body>
              
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function calculateTotalPrice(products) {
  return products.reduce((total, productInfo) => {
    return total + (productInfo.product ? productInfo.product.precio * productInfo.amount : 0);
  }, 0);
}

export default OrdersPage;
