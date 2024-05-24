<template>
    <section id="content">
     <h1 class="subheader">Pagina No Encontrada</h1>
     <h2>La Pagina que Buscas no Existe, Intentalo mas tarde</h2>
    </section>
 </template>
 <script>
 import { defineComponent } from 'vue'
 
 export default defineComponent({
   name:'ErrorComponent',
   setup() {
       
   },
 })
 </script>
 <style>
 #content{
    width: 70%;
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