<template>
    <div id="slider">
        <div class="search-container">
            <Q-input filled dense outlined v-model="valorBuscado" placeholder="Buscar..." @keyup.enter="Buscar" style="width:30%; " >
            </Q-input>
            <q-btn class="claseBoton" round icon=" search" @click="Buscar" />
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { QInput, QBtn } from 'quasar';

export default defineComponent({
    name: 'SliderComponent',
    components: {
        QInput,
        QBtn
    },
    setup() {
        const valorBuscado = ref('');

        const Buscar = () => {
            console.log('Buscado:', valorBuscado.value);
        };

        return {
            valorBuscado,
            Buscar
        };
    }
});
</script>

<style>
#slider {
    width: 100%;
    height: 100%;
    color: white;
    text-shadow: 0px 0px 5px #444;

    /* DEGRADADO*/
    background: rgba(243, 48, 48, 1);
    background: -moz-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgba(243, 48, 48, 1)), color-stop(30%, rgba(243, 48, 48, 1)), color-stop(100%, rgba(0, 28, 73, 1)));
    background: -webkit-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -o-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -ms-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: radial-gradient(ellipse at center, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f33030', endColorstr='#001c49', GradientType=1);
}

.btn-white {
    display: block;
    background: white;
    color: rgb(88, 88, 88);
    width: 100px;
    height: 40px;
    margin: 20px auto;
    font-size: 18px;
    text-transform: uppercase;
    text-shadow: none;
    text-decoration: none;
    line-height: 35px;
    box-shadow: 0px 0px 5px rgb(88, 88, 88);
    border-radius: 4px;
    transition: 300ms all;
}

.btn-white:hover {
    background: #444;
    color: white;
    transition: 300ms all;
}

.search-container {
    display: flex;
    justify-content: center;
    padding: 20px;
}



.claseBoton {
    color: rgba(0, 28, 73, 1);
    background-color: rgba(243, 48, 48);
    height: 30%;
    border-radius: 60%;
    border: none;
    margin-left: 1%;
    margin-top: 0.5%;
}
.claseBoton:hover {
    color: white;
    background-color: rgba(243, 48, 48);
    height: 30%;
    border-radius: 60%;
    border: none;
    margin-left: 1%;
    margin-top: 0.5%;
}

input[type="text"],
textarea{
    width: 100%;
    min-height: 30px;
    border: 1px solid #ccc;
    padding: 3px;
    margin-bottom: 5px;
    transition: 300ms all;
}

input[type="text"]:focus,
textarea:focus{
    box-shadow: 0px 0px 5px #ff2e2e inset;
}
</style>
