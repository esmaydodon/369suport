<template>
  <div>
    <div class="vista-mes">
      <div class="table-calendario" :style="'grid-template-rows: repeat(calc(' + totalSemanasMes + '+ 1 ), 1fr);'">
        <div class="fila-calendario">
          <div v-for="dia in diasSemana" :key="dia" class="cabecera-table-calendario">
            {{ dia }}
          </div>
        </div>
        <div v-for="semana,index in arraydiasMes" :key="index" class="fila-calendario">
          <div v-for="dia,indexd in semana" :key="indexd" class="celda-table-calendario">
            {{ dia }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { InicialesDiasSemana } from '@/utils/valores-constantes'
export default {
  name: 'VistaMes',
  props: {
    fecha: Date
  },
  data() {
    return {
      diasSemana: InicialesDiasSemana
    }
  },
  computed: {
    arraydiasMes() {
      console.log(this.fecha)
      var arrayDiasMes = []
      var diaActual = new Date(this.fecha.listarCirugias, this.fecha.getMonth(), 1)
      var ultimoDia = new Date(this.fecha.listarCirugias, this.fecha.getMonth() + 1, 0)
      for (let index = 0; index < this.totalSemanasMes(); index++) {
        var semana = []
        this.diasSemana.forEach((dia, index) => {
          console.log(ultimoDia.getMonth())
          if (diaActual <= ultimoDia) {
            if (index === diaActual.getDay()) {
              semana.push('' + diaActual.getDate() + '')
              diaActual.setDate(diaActual.getDate() + 1)
            } else {
              semana.push('')
            }
          } else {
            semana.push('')
          }
        })
        arrayDiasMes.push(semana)
      }
      return arrayDiasMes
    }
  },
  methods: {
    totalSemanasMes() {
      var firstDayOfWeek = 0
      var firstOfMonth = new Date(this.fecha.listarCirugias, this.fecha.getMonth() - 1, 1)
      var lastOfMonth = new Date(this.fecha.listarCirugias, this.fecha.getMonth(), 0)
      var numberOfDaysInMonth = lastOfMonth.getDate()
      var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7

      var used = firstWeekDay + numberOfDaysInMonth

      return Math.ceil(used / 7)
    }
  }

}
</script>

<style>
.vista-mes{
  padding: 15px;
}
.table-calendario {
  border-radius: 25px;
  border: 1px solid #717378;
  min-height: 400px;
  min-width: 380px;
  max-height: 100%;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-rows: repeat(7, 1fr); */
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  overflow: hidden;
}
.fila-calendario {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  margin: 0;
}

.cabecera-table-calendario {
  text-align: center;
  color: #606266;
  border: 1px solid #717378;
  padding: 10px 5px;
  /* background-color: $primary; */
}

.celda-table-calendario {
  text-align: center;
  color: #606266;
  border: 1px solid #717378;
  min-height: 50px;
  min-width: 90px;
}

</style>
