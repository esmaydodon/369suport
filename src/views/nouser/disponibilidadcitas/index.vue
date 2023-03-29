<template>
  <div v-loading="loading" style="height: 100vh;">
    <div class="app-container">
      <el-row :gutter="10">
        <el-col :xs="24" :md="6" style="padding: 10px; border-radius: 15px;">
          <img src="@/assets/img/logo_landscape.png" alt="Hospital Regional Docente Cajamarca">
        </el-col>
        <el-col :xs="22" :sm="4" style="margin: 5px 20px; display: flex; align-items: center; height: 100%;">
          <el-select v-model="query.especialidad" placeholder="Buscar especialidad" clearable filterable>
            <el-option v-for="item in opciones" :key="item.label" :value="item.value" :label="item.label" />
          </el-select>
        </el-col>
        <el-col :xs="22" :sm="4" style="margin: 5px 20px;">
          <el-date-picker v-model="query.fecha" placeholder="" :picker-options="pickerOptions" format="dd/MM/yyyy" value-format="yyyy-MM-dd H:mm:ss" />
        </el-col>
        <el-col :xs="22" :sm="3" style="margin: 5px 20px;">
          <el-button type="primary" plain icon="el-icon-search" style="width: 100%;" @click="buscarDatos" />
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10" style="max-height: 88vh; overflow-y: auto;background-color: #FFFFFF;margin: 0px;">
      <el-col :xs="24" :sm="sedesconoce.length > 0 ? 8 :12">
        <div class="app-container">
          <el-card header="CITAS DISPONIBLE">
            <div style="max-height: 72vh; overflow-y: auto;">
              <div v-for="item in disponibles" :key="item.idServicio + '-' + item.especialidad" style="margin: 10px 0px;">
                <el-card v-if="item.cuposDisponibles < 25" style="background-color: #ffc340a8;">
                  <el-row>
                    <el-col :span="24">
                      <el-row>
                        <strong>Servicio: </strong>{{ item.servicio }}
                      </el-row>
                      <el-row>
                        <strong>Especialidad: </strong>{{ item.especialidad }}
                      </el-row>
                      <el-divider />
                      <el-row>
                        <strong>Citas desde: </strong>{{ item.fechaCitaMasCercana }}
                      </el-row>
                      <el-row>
                        <strong>Dias con citas disponibles: </strong>
                        <div>
                          <ul>
                            <li v-for="fecha, index in item.fechasConCuposDisponibles" :key="index">
                              {{ fecha }}
                            </li>
                          </ul>
                        </div>
                      </el-row>
                    </el-col>
                    <el-col :span="24" style="background-color: #FFFFFF; padding: 10px; border-radius: 15px; margin-top: 15px;">
                      <el-row>
                        <strong>RESTANTES</strong>
                      </el-row>
                      <el-row type="flex" justify="center" align="middle" style="color: #13ce66; font-size: 20; font-weight: 900;">
                        {{ item.cuposDisponibles }}
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card v-else style="background-color: #a9e159a8;">
                  <el-row>
                    <el-col :span="24">
                      <el-row>
                        <strong>Servicio: </strong>{{ item.servicio }}
                      </el-row>
                      <el-row>
                        <strong>Especialidad: </strong>{{ item.especialidad }}
                      </el-row>
                      <el-divider />
                      <el-row>
                        <strong>Citas desde: </strong>{{ item.fechaCitaMasCercana }}
                      </el-row>
                      <el-row>
                        <strong>Dias con citas disponibles: </strong>
                        <div>
                          <ul>
                            <li v-for="fecha, index in item.fechasConCuposDisponibles" :key="index">
                              {{ fecha }}
                            </li>
                          </ul>
                        </div>
                      </el-row>
                    </el-col>
                    <!-- <el-col :span="24" style="background-color: #FFFFFF; padding: 10px; border-radius: 15px; margin-top: 15px;">
                        <el-row>
                          <strong>RESTANTES</strong>
                        </el-row>
                        <el-row type="flex" justify="center" align="middle" style="color: #13ce66; font-size: 20; font-weight: 900;">
                          {{ item.cuposDisponibles }}
                        </el-row>
                      </el-col> -->
                  </el-row>
                </el-card>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="sedesconoce.length > 0 ? 8 :12">
        <div class="app-container">
          <el-card header="CITAS NO DISPONIBLE">
            <div style="max-height: 72vh; overflow-y: auto;">
              <div v-for="item in nodisponible" :key="item.idServicio + '-' + item.especialidad" style="margin: 10px 0px;">
                <el-card style="background-color: #ff4040a8;">
                  <el-row>
                    <el-col :span="24">
                      <el-row>
                        <strong>Servicio: </strong>{{ item.servicio }}
                      </el-row>
                      <el-row>
                        <strong>Especialidad: </strong>{{ item.especialidad }}
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="sedesconoce.length > 0" :xs="24" :sm="8">
        <div class="app-container">
          <el-card header="SE DESCONOCE LA DISPONIBILIDAD DE CITA">
            <div style="max-height: 72vh; overflow-y: auto;">
              <div v-for="item in sedesconoce" :key="item.idServicio + '-' + item.especialidad" style="margin: 10px 0px;">
                <el-card>
                  <el-row>
                    <el-col :span="24">
                      <el-row>
                        <strong>Servicio: </strong>{{ item.servicio }}
                      </el-row>
                      <el-row>
                        <strong>Especialidad: </strong>{{ item.especialidad }}
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

// Resource
import DisponibilidadCitasResource from '@/api/disponibilidad-citas'
const disponibilidadCitasResource = new DisponibilidadCitasResource()
export default {
  name: 'DisponibilidadCitas',
  data() {
    return {
      config: {
        ahora: null,
        ayer: null,
        ultimodia: null
      },
      opciones: [],
      query: {
        fecha: null,
        especialidad: null
      },
      loading: false,
      disponibles: [],
      nodisponible: [],
      sedesconoce: [],
      pickerOptions: {
        disabledDate(time) {
          const ahora = new Date()
          const ayer = ahora.setDate(ahora.getDate() - 1)
          const ultimodia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0)
          let disable = false

          if (time.getTime() < ayer) {
            disable = true
          } else if (time.getTime() > ultimodia) {
            disable = true
          }
          return disable
        }
      }
    }
  },
  mounted() {
    this.loading = true
    this.cargarOpciones()
    this.cargarData()
    setInterval(() => { this.cargarData() }, 60000)
  },
  methods: {
    cargarOpciones() {
      disponibilidadCitasResource.opciones()
        .then(
          (response) => {
            const { data } = response
            this.opciones = data
          }
        )
        .catch(
          (error) => {
            console.log(error)
          }
        )
    },
    cargarData() {
      console.log('cargando data')
      disponibilidadCitasResource.cargarData(this.query)
        .then(
          (response) => {
            const { data } = response
            const tempDisponbles = []
            const tempNoDisponible = []
            const tempSeDesconoce = []
            data.forEach((elemento) => {
              if (elemento.cuposDisponibles > 5) {
                tempDisponbles.push(elemento)
              }
              if (elemento.cuposDisponibles <= 5 && elemento.cuposDisponibles >= 0) {
                tempNoDisponible.push(elemento)
              }
              if (elemento.cuposDisponibles < -4) {
                tempSeDesconoce.push(elemento)
              }
            })
            tempDisponbles.sort(this.compare)
            tempNoDisponible.sort(this.compare)
            tempSeDesconoce.sort(this.compare)
            this.disponibles = tempDisponbles
            this.nodisponible = tempNoDisponible
            this.sedesconoce = tempSeDesconoce
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    buscarDatos() {
      this.loading = true
      this.cargarData()
    },
    // unirServiciosPorEspecialidadNodisponibles(tempNoDisponible) {
    //   const lista = []
    //   tempNoDisponible.forEach(element => {
    //     const result = lista.find(({ especialidad }) => especialidad === element.especialidad)
    //     if
    //   })
    //   return lista
    // },
    compare(a, b) {
      return b.cuposDisponibles - a.cuposDisponibles
    }
  }
}
</script>
