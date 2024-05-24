<template>
    <aside id="sidebar">
        <div  class="sidebar-item">
            <h3>TU OPINION ES IMPORTANTE</h3>
            <a href="#" class="btn btn-success">Crear Reseña</a>
        </div>

    </aside>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
    name: 'SideBar',
    setup() {

    }
});
</script>
<style>
#sidebar{
    width: 10%;
    float:right;
    padding: 20px;
   margin: 0%;
    
}
.sidebar-item{
    background: #f7f7f7;
}
.sidebar-item h3{
    text-transform: uppercase;
    font-size: 18px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 3px solid #eee;
}


.btn{
   display: block;
   background:rgba(0, 28, 73, 1);
   color: white;
   padding: 15px; 
   font-weight: bold;
   text-transform: uppercase;
   font-size: 14px;
   text-decoration: none;
   transition: 300ms all;
   border: none;
   cursor:pointer;
}
.btn-success{
    background:rgba(0, 28, 73, 1);
}

.btn-success:hover{
    background: rgb(218, 38, 38);
}
</style>