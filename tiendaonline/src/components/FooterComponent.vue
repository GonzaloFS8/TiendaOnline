<template>
    <footer id="footer">
      <div class="container">
        <div class="footer-content">
          <div class="logo">
            <img src="../assets/imagenes/logoTienda.png" alt="Logotipo" />
            <span class="brand">El Rincón del <strong>Fútbol Antiguo</strong></span>
          </div>
          <div class="contact-info">
            <p>Contacto:</p>
            <p>Email: info@rincondelfutbolantiguo.com</p>
            <p>Teléfono: +123456789</p>
          </div>
          <div class="redes-sociales">
            <a href="#"><i class="fab fa-facebook-f"></i>Facebook</a>
            <br>
            <a href="#"><i class="fab fa-twitter"></i>Twitter</a>
            <br>
            <a href="#"><i class="fab fa-instagram"></i>Instagram</a>
          </div>
          <p>&copy; 2024 El Rincón del Fútbol Antiguo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterComponent'
  };
  </script>
  
  <style scoped>
  #footer {
    background-color: #343a40;
    color: #fff;
    padding: 20px 0; 
  }
  
  .container {
    width: 85%;
    margin: 0 auto;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1); 
    padding-top: 20px; 
  }
  
  .logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .brand {
    font-size: 18px;
  }
  
  .contact-info p {
    margin: 5px 0;
  }
  
  .redes-sociales a {
    color: #fff;
    font-size: 10;
    margin-right: 10px;
  }
  
  .footer-content p {
    margin: 0; 
  }
  
  </style>
  