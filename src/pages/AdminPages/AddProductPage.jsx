import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import authService from '../../services/auth.service.js'; // Asegúrate de importar authService correctamente
import {  useNavigate } from "react-router-dom";

function AddProductPage({ history }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '', // Cambié esto de un campo de radio a un campo de texto
    'product-image': null,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '', // Asegúrate de que coincida con el nombre del campo en tu formulario
      'product-image': null,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key]);
      }
    }

    authService.api
      .post('/api/products/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Product created:', response.data);
        clearForm();
        setSuccessMessage('Producto creado correctamente');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);

        if (formData.categoria === 'plantas' || formData.categoria === 'ramos') {
          // Redirige al usuario a la página de lista de productos.
          navigate('/admin/product');
        } else {
          setErrorMessage('Categoria no válida');
        }

        // Después de crear el producto con éxito, redirige al usuario a la página de lista de productos.
        navigate('/admin/product');
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        setSuccessMessage('');
        setErrorMessage('Error al crear el producto');
      });
  };

  return (
    <div>
      <div className="message-container">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </div>

      <Container>
        <Row>
          <Col xs={12} md={6} lg={6} className="mx-auto">
            <form className="formAdd" onSubmit={onSubmit}>
              <h2 className="addProduct">Crear Producto</h2>
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
                <label htmlFor="categoria" className="form-label">
                  Categoría:
                </label>

                {/* <input
                  type="text"
                  className="form-control"
                  id="categoria"
                  name="categoria" 
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                /> */}

              <select className="form-select form-select-lg mb-3"  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} >
                <option  disabled>Elije:</option>
                <option value="plantas">Plantas</option>
                <option value="ramos">Ramos</option> 
              </select>

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
      </Container>
    </div>
  );
}

export default AddProductPage;
