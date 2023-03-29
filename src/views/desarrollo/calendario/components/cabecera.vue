<template>
  <div class="cabecera-calendario">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="mes-actual">
          <span>{{ nombreMes() + " " + anio }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="16" class="buttons-cabecera">
        <div class="hidden-sm-and-down">
          <el-button-group>
            <el-button type="primary">VISTA MES</el-button>
            <el-button type="primary">VISTA SEMANAL</el-button>
            <el-button type="primary">VISTA DIAS</el-button>
          </el-button-group>
        </div>
        <div class="hidden-md-and-up">
          <el-row align="middle">
            <el-col :xs="24">
              <el-button type="primary" style="width: 100%; margin:3px 0;">VISTA MES</el-button>
            </el-col>
            <el-col :xs="24">
              <el-button type="primary" style="width: 100%; margin:3px 0;">VISTA SEMANAL</el-button>
            </el-col>
            <el-col :xs="24">
              <el-button type="primary" style="width: 100%; margin:3px 0;">VISTA DIAS</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { MesesFirstUpper } from '@/utils/valores-constantes'
import 'element-ui/lib/theme-chalk/display.css'
export default {
  name: 'Cabecera',
  props: {
    fecha: Date
  },
  data() {
    return {
      dia: this.fecha.getDay(),
      mes: this.fecha.getMonth(),
      anio: this.fecha.listarCirugias
    }
  },
  methods: {
    nombreMes() {
      console.log(MesesFirstUpper)
      return MesesFirstUpper[this.mes]
    }
  }
}
</script>

<style>
.cabecera-calendario {
  padding: 15px;
  text-align: center;
  width: 100%;
  color: #606266;
}
.mes-actual {
  text-align: center;
  font-size: calc(3vmax * 1.5);
  margin: 5px 0;
}
.buttons-cabecera {
  text-align: center;
}
@media (min-width: 768px) {
  .mes-actual {
  text-align: center;
  font-size: calc(1.5vmax * 1.5);
  margin: 5px 0;
}
}
</style>
