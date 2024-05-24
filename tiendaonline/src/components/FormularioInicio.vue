<template>
    <section id="content">
     <h2 class="subheader">Formulario De Inicio De Sesion</h2>
    </section>
 </template>
 <script>
 import { defineComponent } from 'vue'
 
 export default defineComponent({
   name:'FormularioInicio',
   setup() {
       
   },
 })
 </script>
 <style>
#content{
    width: 60%;
    float:left;
    min-height: 650px;
    margin-right: 20px;
}
.subheader{
    font-size: 38px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}
</style>