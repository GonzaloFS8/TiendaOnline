<template>
    <header id="header">
            <div class="center">
                <!-- LOGO -->
                <div id="logo">
                    <img src="../assets/imagenes/logoTienda.png" class="app-logo" alt="Logotipo" />
                    <span id="brand" style="font-family:Helvetica;color:white" >
                        EL RINCON DEL <strong>FUTBOL</strong> ANTIGUO
                    </span>
                </div>
                
                <!-- MENU -->
                <nav id="menu">
                    <ul>
                        <li>
                            <router-link to="/home" active-class="active">Inicio</router-link>
                        </li>
                        <li>
                            <router-link to="/formulario" active-class="active">Iniciar Sesion</router-link>
                        </li>
                                             
                    </ul>
                </nav>

                <!--LIMPIAR FLOTADOS-->
                <div class="clearfix"></div>
            </div>
        </header>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name:'HeadComponent',
    setup() {
        
      
    },
})
</script>
<style >
#header {
    height: 120px;
    width: 100%;
    background: rgb(243, 48, 48);
    border-bottom: 3px solid  rgba(0, 28, 73, 1);
    border-top: 5px solid rgba(0, 28, 73, 1);
    ;
}
.center{
    width: 85%;
    margin: 0px auto;
}
#logo {
    width: 40%;
    font-size: 30px;
    float: left;
    margin-top: 35px;
    margin-left: 10%;
}

#logo img {
    display: block;
    float: left;
    height: 75px;
    margin-top: -9px;
    margin-right: 10px;
    animation: latir infinite 5s linear;
}
#menu{
    width: 40%;
    float:right;
    font-size: 18px;
    display: contents;
}

#menu ul{
    line-height: 85px;
    width: 32%;
    float:left;
    margin-left: 14%;
}

#menu ul li{
    display: inline-block;
    list-style: none;
    height: 46px;
    margin-left: 15px;
    margin-right: 15px;
}

#menu a{
    text-decoration: none;
    color: #363636;
    transition: 300ms all;
}


#menu a:hover
{
    color: #fdfdfd;
}

#menu .active{
    color: #fdfdfd;
}

/*RESPONSIVE*/

/*Desde la anchura 963px hasta la anchura 1488px de pantalla*/
@media (max-width: 1488px){
    .center{
        width: 85%;
    }
}

@media (max-width: 497px){
    #header{
        min-height: 130px;
        overflow:hidden;
    }
    #menu,
    #menu ul{
        line-height: 50px;
    }

    #menu ul li{
        margin-left: 7px;
        margin-right: 7px;
    }
}

@media (max-width: 1314px){
    .center{
        width: 95%;
    }

    #menu ul{
        width: auto;
    }
}
@media (max-width: 881px){
    #logo{
        width: 265px;
    }

    #menu{
        width: auto;
    }
}


@media (max-width: 813px){
    #logo{
        float:none;
        /*width: 240px;*/
        margin: 0px auto;
        margin-top: 20px;
    }

    #menu,
    #menu ul{
       clear:both;
       float:none;
       width: 100%;
       margin: 0px;
       padding: 0px;
       line-height: 43px;
    }
}
</style>