import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AddProductPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    'product-image': null,
  });

  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 
  const [filterCategory, setFilterCategory] = useState('todas');

  function productsFiltered(){
    let response = products

    if(filterCategory !== "todas"){
      response = response.filter(prod => prod.categoria === filterCategory)
    }

    return response
  }

   

  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      'product-image': null,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const backendUrl = 'http://localhost:5005';

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key]);
      }
    }

    axios
      .post(`${backendUrl}/api/products/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Product created:', response.data);
        axiosProducts();
        clearForm();
        setSuccessMessage('Producto creado correctamente');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        setSuccessMessage('');
        setErrorMessage('Error al crear el producto');
      });
  };

  const axiosProducts = () => {
    const backendUrl = 'http://localhost:5005';

    axios
      .get(`${backendUrl}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDeleteProduct = (productId) => {
    const backendUrl = 'http://localhost:5005';

    axios
      .delete(`${backendUrl}/api/products/${productId}`)
      .then((response) => {
        console.log('Producto eliminado:', response.data);
        axiosProducts();
        setSuccessMessage('Se ha borrado el producto exitosamente');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
        setSuccessMessage('');
        setErrorMessage('Error al borrar el producto');
      });
  };

  useEffect(() => {
    axiosProducts();
  }, []);


  return (
    <div>
    
    <div className="message-container">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        
      </div>

      <Container>
        <Row>
          <Col xs={12} md={6} lg={6} className='mx-auto'>
            <form className='formAdd' onSubmit={onSubmit}>
            <h2 className='addProduct'>Crear Producto</h2>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="precio" className="form-label">
                  Precio:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoría: </label>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="categoria-ramos"
                    name="categoria"
                    value="Ramos"
                    checked={formData.categoria === 'Ramos'}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                  <label className="form-check-label" htmlFor="categoria-ramos">
                       Ramos
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="categoria-plantas"
                    name="categoria"
                    value="Plantas"
                    checked={formData.categoria === 'Plantas'}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                  <label className="form-check-label" htmlFor="categoria-plantas">
                    Plantas
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="product-image" className="form-label">
                  Imagen del producto:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="product-image"
                  name="product-image"
                  onChange={(e) => setFormData({ ...formData, 'product-image': e.target.files[0] })}
                />
              </div>
              <button type="submit" className="btn-info text-light btn ">
                Crear Producto
              </button>
            </form>
          </Col>
        </Row>

        <div className='listaProductos'>
          <h2>Lista de Productos</h2>
        </div>

        <Row>
        <Col lg={3}>

        Select Category

          <ul class="list-group">
            <li class={`list-group-item ${filterCategory === 'todas' ? 'active':''}` } onClick={()=>setFilterCategory("todas")}>Todas</li>
            <li class={`list-group-item ${filterCategory === 'ramos' ? 'active':''}` } onClick={()=>setFilterCategory("ramos")}>Ramos</li>
            <li class={`list-group-item ${filterCategory === 'planta' ? 'active':''}` } onClick={()=>setFilterCategory("planta")}>Plantas</li> 
          </ul>
          
          <div class="d-grid gap-2 m-3">
               <a class="btn btn-success" href="#" role="button">Crear Producto</a>
                <a class="btn btn-info" href="#" role="button">Ver ordenes</a>
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
                  <Card.Text className='cardText'>{product.descripcion}</Card.Text>
                  <Card.Text>Precio: {product.precio}</Card.Text>
                  <Card.Text>Categoría: {product.categoria}</Card.Text>
                  <Link to={`/admin/products/${product._id}`} className="mr-3 btn-info text-light btn">
                    Detalles
                  </Link>
                  <button
                    className="btn btn-danger mr-3"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Borrar
                  </button>
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

export default AddProductPage;
