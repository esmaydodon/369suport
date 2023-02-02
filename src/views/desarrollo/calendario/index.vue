<template>
  <div class="calendario-container el-card">
    <cabecera :fecha="fecha_seleccionada" />
    <vista-mes :fecha="fecha_seleccionada" />
    <!-- <el-calendar></el-calendar> -->
  </div>
</template>

<script>
// Componentes
import Cabecera from './components/cabecera'
import VistaMes from './components/vista-mes.vue'
export default {
  name: 'Calendario',
  components: { Cabecera, VistaMes },
  props: {
    fecha: {
      type: [Date, String],
      default: new Date()
    }
  },
  data() {
    return {
      fecha_seleccionada: this.fecha instanceof Date ? this.fecha : new Date(this.fecha)
    }
  }
}
</script>

<style>
.calendario-container {
  display: block;
  margin: 15px;
  min-height: 400px;
  min-width: 380px;
  max-height: 100%;
  max-width: 100%;
}

</style>
